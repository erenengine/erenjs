import SHADER_STR from './shaders/shader.wgsl';
import { Device } from '../../dist/device.js';
import { flattenVertices, Vertex, VERTEX_DESC } from './vertex';
import { mat4, vec2, vec3 } from 'gl-matrix';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

const TEST_VERTICES: Vertex[] = [{
  pos: vec2.fromValues(-0.5, -0.5),
  color: vec3.fromValues(1, 0, 0),
}, {
  pos: vec2.fromValues(0.5, -0.5),
  color: vec3.fromValues(0, 1, 0),
}, {
  pos: vec2.fromValues(0.5, 0.5),
  color: vec3.fromValues(0, 0, 1),
}, {
  pos: vec2.fromValues(-0.5, 0.5),
  color: vec3.fromValues(1, 1, 1),
}];

const TEST_INDICES: number[] = [0, 1, 2, 2, 3, 0];

interface CombinedBuffer {
  buffer: GPUBuffer;
  vertexOffset: number;
  indexOffset: number;
  indexCount: number;
}

function createCombinedBuffer(device: Device): CombinedBuffer {
  const flatVertexData = flattenVertices(TEST_VERTICES);
  const vertexFloatLength = flatVertexData.length;
  const vertexSize = vertexFloatLength * 4;
  const indexCount = TEST_INDICES.length;
  const indexSize = indexCount * 2;

  const indexOffset = (vertexSize + 3) & ~3; // 4-byte alignment
  const totalSize = indexOffset + indexSize;

  const buffer = device.createBuffer({
    label: 'Test Buffer',
    size: totalSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  const mapping = new Uint8Array(buffer.getMappedRange());
  new Float32Array(mapping.buffer).set(flatVertexData);
  new Uint16Array(mapping.buffer, indexOffset, indexCount).set(TEST_INDICES);
  buffer.unmap();

  return {
    buffer,
    vertexOffset: 0,
    indexOffset,
    indexCount,
  };
}


export class TestRenderPass {
  #device: Device;
  #pipeline: GPURenderPipeline;
  #combinedBuffer: CombinedBuffer;

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
        topology: 'triangle-strip',
        stripIndexFormat: 'uint16',
      },
    });

    this.#combinedBuffer = createCombinedBuffer(device);
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

    passEncoder.setVertexBuffer(0, this.#combinedBuffer.buffer, this.#combinedBuffer.vertexOffset);
    passEncoder.setIndexBuffer(this.#combinedBuffer.buffer, 'uint16', this.#combinedBuffer.indexOffset);

    passEncoder.drawIndexed(this.#combinedBuffer.indexCount, 1, 0, 0, 0);
    passEncoder.end();
  }
}
