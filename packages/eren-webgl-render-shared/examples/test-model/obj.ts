import { vec2, vec3 } from 'gl-matrix';

interface FaceVertex {
  vertexIndex: number;
  textureCoordsIndex: number;
  vertexNormalIndex: number;
}

interface Face {
  material: string;
  group: string;
  smoothingGroup: number;
  vertices: FaceVertex[];
}

interface Model {
  name: string;
  vertices: vec3[];
  textureCoords: vec2[];
  vertexNormals: vec3[];
  faces: Face[];
}

interface ParseResult {
  models: Model[];
  materialLibraries: string[];
}

export class OBJFile {
  readonly #fileContents: string;
  readonly #defaultModelName: string;

  #result!: ParseResult;
  #currentMaterial!: string;
  #currentGroup!: string;
  #smoothingGroup!: number;

  constructor(fileContents: string, defaultModelName = 'untitled') {
    this.#fileContents = fileContents;
    this.#defaultModelName = defaultModelName;
  }

  parse(): ParseResult {
    this.#resetState();

    const stripComments = (line: string): string => {
      const idx = line.indexOf('#');
      return idx >= 0 ? line.slice(0, idx) : line;
    };

    const lines = this.#fileContents.split(/\r?\n/);

    lines.forEach((rawLine) => {
      const line = stripComments(rawLine)
        .replace(/\s\s+/g, ' ')
        .trim();

      if (line.length === 0) return;

      const parts = line.split(' ');
      const keyword = parts[0].toLowerCase();

      switch (keyword) {
        case 'o':
          this.#parseObject(parts);
          break;
        case 'g':
          this.#parseGroup(parts);
          break;
        case 'v':
          this.#parseVertex(parts);
          break;
        case 'vt':
          this.#parseTextureCoord(parts);
          break;
        case 'vn':
          this.#parseVertexNormal(parts);
          break;
        case 's':
          this.#parseSmoothing(parts);
          break;
        case 'f':
          this.#parseFace(parts);
          break;
        case 'mtllib':
          this.#parseMtlLib(parts);
          break;
        case 'usemtl':
          this.#parseUseMtl(parts);
          break;
      }
    });

    return this.#result;
  }

  #resetState(): void {
    this.#result = { models: [], materialLibraries: [] };
    this.#currentMaterial = '';
    this.#currentGroup = '';
    this.#smoothingGroup = 0;
  }

  #currentModel(): Model {
    if (this.#result.models.length === 0) {
      this.#result.models.push({
        name: this.#defaultModelName,
        vertices: [],
        textureCoords: [],
        vertexNormals: [],
        faces: [],
      });
    }
    return this.#result.models[this.#result.models.length - 1];
  }

  #parseObject(tokens: string[]): void {
    const name = tokens[1] ?? this.#defaultModelName;
    this.#result.models.push({
      name,
      vertices: [],
      textureCoords: [],
      vertexNormals: [],
      faces: [],
    });
    this.#currentGroup = '';
    this.#smoothingGroup = 0;
  }

  #parseGroup(tokens: string[]): void {
    if (tokens.length !== 2)
      throw new Error('Group statements must have exactly 1 argument (e.g. "g group_1").');
    this.#currentGroup = tokens[1];
  }

  #parseVertex(tokens: string[]): void {
    const [x = '0', y = '0', z = '0'] = tokens.slice(1);
    this.#currentModel().vertices.push(vec3.fromValues(parseFloat(x), parseFloat(y), parseFloat(z)));
  }

  #parseTextureCoord(tokens: string[]): void {
    const [u = '0', v = '0'] = tokens.slice(1);
    this.#currentModel().textureCoords.push(vec2.fromValues(parseFloat(u), parseFloat(v)));
  }

  #parseVertexNormal(tokens: string[]): void {
    const [x = '0', y = '0', z = '0'] = tokens.slice(1);
    this.#currentModel().vertexNormals.push(vec3.fromValues(parseFloat(x), parseFloat(y), parseFloat(z)));
  }

  #parseSmoothing(tokens: string[]): void {
    if (tokens.length !== 2)
      throw new Error('Smoothing group statements must have exactly 1 argument (e.g. "s 1" or "s off").');
    this.#smoothingGroup = tokens[1].toLowerCase() === 'off' ? 0 : parseInt(tokens[1], 10);
  }

  #parseFace(tokens: string[]): void {
    if (tokens.length < 4)
      throw new Error('Face statement must have at least 3 vertices (e.g. "f v1 v2 v3").');

    const face: Face = {
      material: this.#currentMaterial,
      group: this.#currentGroup,
      smoothingGroup: this.#smoothingGroup,
      vertices: [],
    };

    tokens.slice(1).forEach((vertexToken) => {
      const indices = vertexToken.split('/');
      if (indices.length < 1 || indices.length > 3)
        throw new Error('Invalid vertex specification inside face.');

      let [vIdx, vtIdx, vnIdx] = indices;

      let vertexIndex = parseInt(vIdx, 10);
      if (vertexIndex === 0)
        throw new Error('OBJ vertex indices are 1-based and may not be zero.');

      if (vertexIndex < 0) {
        vertexIndex = this.#currentModel().vertices.length + 1 + vertexIndex;
      }

      face.vertices.push({
        vertexIndex,
        textureCoordsIndex: vtIdx ? parseInt(vtIdx, 10) : 0,
        vertexNormalIndex: vnIdx ? parseInt(vnIdx, 10) : 0,
      });
    });

    this.#currentModel().faces.push(face);
  }

  #parseMtlLib(tokens: string[]): void {
    if (tokens.length >= 2) this.#result.materialLibraries.push(tokens[1]);
  }

  #parseUseMtl(tokens: string[]): void {
    if (tokens.length >= 2) this.#currentMaterial = tokens[1];
  }
}
