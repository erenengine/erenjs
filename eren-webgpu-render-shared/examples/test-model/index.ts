import { Instance } from '../../dist/instance.js';
import { Adapter } from '../../dist/adapter.js';
import { Context } from '../../dist/context.js';
import { Device } from '../../dist/device.js';
import { TestRenderer } from './renderer';
import { mat3, quat, vec2, vec3 } from 'gl-matrix';
import { createMeshBuffer } from './mesh';
import { OBJFile } from './obj';
import { Vertex } from './vertex.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const instance = new Instance();
const adapter = await Adapter.create(instance);
const context = new Context(canvas);
const device = await Device.create(adapter, context, instance.preferredFormat);

const res = await fetch('./assets/viking_room.png');
const blob = await res.blob();                 // <- 브라우저 디코더 사용
const bitmap = await createImageBitmap(blob);  // RGBA8 기본 포맷

const renderer = new TestRenderer(device, instance.preferredFormat, canvas.width, canvas.height, bitmap);

function loadObjMesh(objBytes: Uint8Array) {
  const objFile = new OBJFile(new TextDecoder('utf-8').decode(objBytes));
  const { models } = objFile.parse();
  if (!models.length) throw new Error("OBJ에는 최소 1개의 모델(o)이 필요합니다.");

  const model = models[0];

  const vertices: Vertex[] = [];
  const indices: number[] = [];

  // “pos/norm/uv” 조합 → 인덱스
  const unique = new Map<string, number>();

  const rot = mat3.fromQuat(
    mat3.create(),
    quat.setAxisAngle(quat.create(), [1, 0, 0], Math.PI * 1.5)
  );

  const safeVec3 = (arr: vec3[], idx: number) => {
    const v = arr[idx - 1]; // OBJ는 1-based
    return vec3.fromValues(v[0], v[1], v[2]);
  };

  const safeVec2 = (arr: vec2[], idx: number) => {
    const t = arr[idx - 1];
    return vec2.fromValues(t[0], t[1]);
  };

  for (const face of model.faces) {
    for (const fv of face.vertices) {
      const key = `${fv.vertexIndex}/${fv.vertexNormalIndex}/${fv.textureCoordsIndex}`;

      let index = unique.get(key);
      if (index === undefined) {
        const position = safeVec3(model.vertices, fv.vertexIndex);
        vec3.transformMat3(position, position, rot);

        const normal = fv.vertexNormalIndex
          ? safeVec3(model.vertexNormals, fv.vertexNormalIndex)
          : vec3.fromValues(0, 1, 0);

        const texCoord = fv.textureCoordsIndex
          ? safeVec2(model.textureCoords, fv.textureCoordsIndex)
          : vec2.create();

        index = vertices.length;
        vertices.push({ position, normal, texCoord });
        unique.set(key, index);
      }

      indices.push(index);
    }
  }

  return { vertices, indices };
}

function createGroundPlane() {
  const normal = vec3.fromValues(0, 1, 0);

  const positions = [
    // 두 삼각형으로 구성된 정사각형 바닥
    vec3.fromValues(-5, -1, -5),
    vec3.fromValues(5, -1, -5),
    vec3.fromValues(5, -1, 5),
    vec3.fromValues(-5, -1, 5),
  ];

  const vertices = positions.map((pos) => ({
    position: pos,
    normal: normal,
    texCoord: vec2.fromValues(0, 0),
  }));

  const indices = [0, 2, 1, 2, 0, 3];

  return { vertices, indices };
}

const objBytes = await fetch('./assets/viking_room.obj').then(r => r.arrayBuffer());
const objMesh = loadObjMesh(new Uint8Array(objBytes));

const groundPlane = createGroundPlane();

const meshes = [
  createMeshBuffer(device, objMesh.vertices, objMesh.indices),
  createMeshBuffer(device, groundPlane.vertices, groundPlane.indices),
];

function frame() {
  renderer.render(context.getCurrentTexture().createView(), meshes, canvas.width, canvas.height);
  requestAnimationFrame(frame);
}

frame();
