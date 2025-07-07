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
export declare class OBJFile {
    #private;
    constructor(fileContents: string, defaultModelName?: string);
    parse(): ParseResult;
}
export {};
