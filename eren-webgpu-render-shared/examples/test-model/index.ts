import { Instance } from '../../dist/instance.js';
import { Adapter } from '../../dist/adapter.js';
import { Context } from '../../dist/context.js';
import { Device } from '../../dist/device.js';
import { TestRenderer } from './renderer';
import { vec2, vec3 } from 'gl-matrix';
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
    texCoord: vec2.fromValues(0, 0),
  }));

  const indices = [0, 2, 1, 2, 0, 3];

  return { vertices, indices };
}

const groundPlane = createGroundPlane();

const meshes = [
  createMeshBuffer(device, groundPlane.vertices, groundPlane.indices),
];

function frame() {
  renderer.render(context.getCurrentTexture().createView(), meshes, canvas.width, canvas.height);
  requestAnimationFrame(frame);
}

frame();
