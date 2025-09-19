import { Instance } from '../../lib/instance.js';
import { Adapter } from '../../lib/adapter.js';
import { Context } from '../../lib/context.js';
import { Device } from '../../lib/device.js';
import { TestRenderer } from './renderer';
import { vec3 } from 'gl-matrix';
import { createMeshBuffer } from './mesh';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const instance = new Instance();
const adapter = await Adapter.create(instance);
const context = new Context(canvas);
const device = await Device.create(adapter, context, instance.preferredFormat);
const renderer = new TestRenderer(device, instance.preferredFormat, canvas.width, canvas.height);

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
  }));

  const indices = [0, 2, 1, 2, 0, 3];

  return { vertices, indices };
}

function createCubeMesh() {
  let positions = [
    // Front face
    [vec3.fromValues(-0.5, -0.5, 0.5), vec3.fromValues(0.0, 0.0, 1.0)],
    [vec3.fromValues(0.5, -0.5, 0.5), vec3.fromValues(0.0, 0.0, 1.0)],
    [vec3.fromValues(0.5, 0.5, 0.5), vec3.fromValues(0.0, 0.0, 1.0)],
    [vec3.fromValues(-0.5, 0.5, 0.5), vec3.fromValues(0.0, 0.0, 1.0)],
    // Back face
    [vec3.fromValues(0.5, -0.5, -0.5), vec3.fromValues(0.0, 0.0, -1.0)],
    [vec3.fromValues(-0.5, -0.5, -0.5), vec3.fromValues(0.0, 0.0, -1.0)],
    [vec3.fromValues(-0.5, 0.5, -0.5), vec3.fromValues(0.0, 0.0, -1.0)],
    [vec3.fromValues(0.5, 0.5, -0.5), vec3.fromValues(0.0, 0.0, -1.0)],
    // Top face
    [vec3.fromValues(-0.5, 0.5, 0.5), vec3.fromValues(0.0, 1.0, 0.0)],
    [vec3.fromValues(0.5, 0.5, 0.5), vec3.fromValues(0.0, 1.0, 0.0)],
    [vec3.fromValues(0.5, 0.5, -0.5), vec3.fromValues(0.0, 1.0, 0.0)],
    [vec3.fromValues(-0.5, 0.5, -0.5), vec3.fromValues(0.0, 1.0, 0.0)],
    // Bottom face
    [vec3.fromValues(-0.5, -0.5, -0.5), vec3.fromValues(0.0, -1.0, 0.0)],
    [vec3.fromValues(0.5, -0.5, -0.5), vec3.fromValues(0.0, -1.0, 0.0)],
    [vec3.fromValues(0.5, -0.5, 0.5), vec3.fromValues(0.0, -1.0, 0.0)],
    [vec3.fromValues(-0.5, -0.5, 0.5), vec3.fromValues(0.0, -1.0, 0.0)],
    // Right face
    [vec3.fromValues(0.5, -0.5, 0.5), vec3.fromValues(1.0, 0.0, 0.0)],
    [vec3.fromValues(0.5, -0.5, -0.5), vec3.fromValues(1.0, 0.0, 0.0)],
    [vec3.fromValues(0.5, 0.5, -0.5), vec3.fromValues(1.0, 0.0, 0.0)],
    [vec3.fromValues(0.5, 0.5, 0.5), vec3.fromValues(1.0, 0.0, 0.0)],
    // Left face
    [vec3.fromValues(-0.5, -0.5, -0.5), vec3.fromValues(-1.0, 0.0, 0.0)],
    [vec3.fromValues(-0.5, -0.5, 0.5), vec3.fromValues(-1.0, 0.0, 0.0)],
    [vec3.fromValues(-0.5, 0.5, 0.5), vec3.fromValues(-1.0, 0.0, 0.0)],
    [vec3.fromValues(-0.5, 0.5, -0.5), vec3.fromValues(-1.0, 0.0, 0.0)],
  ];

  const vertices = positions.map((pos) => ({
    position: pos[0],
    normal: pos[1],
  }));

  const indices = [
    0, 1, 2, 2, 3, 0, // Front
    4, 5, 6, 6, 7, 4, // Back
    8, 9, 10, 10, 11, 8, // Top
    12, 13, 14, 14, 15, 12, // Bottom
    16, 17, 18, 18, 19, 16, // Right
    20, 21, 22, 22, 23, 20, // Left
  ];

  return { vertices, indices };
}

const groundPlane = createGroundPlane();
const cubeMesh = createCubeMesh();

const meshes = [
  createMeshBuffer(device, groundPlane.vertices, groundPlane.indices),
  createMeshBuffer(device, cubeMesh.vertices, cubeMesh.indices),
];

function frame() {
  renderer.render(context.getCurrentTexture().createView(), meshes, canvas.width, canvas.height);
  requestAnimationFrame(frame);
}

frame();
