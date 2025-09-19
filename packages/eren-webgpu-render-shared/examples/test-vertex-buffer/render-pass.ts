import SHADER_STR from './shaders/shader.wgsl';
import { Device } from '../../lib/device.js';
import { flattenVertices, Vertex, VERTEX_DESC } from './vertex';
import { vec2, vec3 } from 'gl-matrix';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

const TEST_VERTICES: Vertex[] = [
  // 첫 번째 삼각형: 좌하단 → 우하단 → 우상단
  {
    pos: vec2.fromValues(-0.5, -0.5),
    color: vec3.fromValues(1, 0, 0),
  },
  {
    pos: vec2.fromValues(0.5, -0.5),
    color: vec3.fromValues(0, 1, 0),
  },
  {
    pos: vec2.fromValues(0.5, 0.5),
    color: vec3.fromValues(0, 0, 1),
  },

  // 두 번째 삼각형: 우상단 → 좌상단 → 좌하단
  {
    pos: vec2.fromValues(0.5, 0.5),
    color: vec3.fromValues(0, 0, 1),
  },
  {
    pos: vec2.fromValues(-0.5, 0.5),
    color: vec3.fromValues(1, 1, 1),
  },
  {
    pos: vec2.fromValues(-0.5, -0.5),
    color: vec3.fromValues(1, 0, 0),
  },
];

function createVertexBuffer(device: Device): GPUBuffer {
  const flatVertexData = flattenVertices(TEST_VERTICES);
  const vertexFloatLength = flatVertexData.length;
  const vertexSize = vertexFloatLength * 4;

  const buffer = device.createBuffer({
    label: 'Test Buffer',
    size: vertexSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  const mapping = new Uint8Array(buffer.getMappedRange());
  new Float32Array(mapping.buffer).set(flatVertexData);
  buffer.unmap();

  return buffer;
}


export class TestRenderPass {
  #device: Device;
  #pipeline: GPURenderPipeline;
  #vertexBuffer: GPUBuffer;

  constructor(device: Device, format: GPUTextureFormat) {
    this.#device = device;

    const shaderModule = device.createShaderModule({ label: 'Test Shader', code: SHADER_STR });

    const pipelineLayout = device.createPipelineLayout({
      label: 'Test Pipeline Layout',
      bindGroupLayouts: [],
      // WebGPU에서는 pushConstantRanges를 지원하지 않음
    });

    this.#pipeline = device.createRenderPipeline({
      label: 'Test Pipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [VERTEX_DESC],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    this.#vertexBuffer = createVertexBuffer(device);
  }

  recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView) {
    const passEncoder = encoder.beginRenderPass({
      colorAttachments: [{
        view,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: CLEAR_COLOR,
      }],
    });

    passEncoder.setPipeline(this.#pipeline);

    passEncoder.setVertexBuffer(0, this.#vertexBuffer, 0);

    passEncoder.draw(TEST_VERTICES.length, 1);
    passEncoder.end();
  }
}
