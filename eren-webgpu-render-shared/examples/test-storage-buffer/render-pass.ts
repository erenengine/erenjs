import SHADER_STR from './shaders/shader.wgsl';
import { Device } from '../../dist/device.js';
import { flattenVertices, Vertex, VERTEX_DESC } from './vertex';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { flattenSBO, StorageBufferObject } from './sbo';

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
  #sboBuffer: GPUBuffer;
  #sboBindGroup: GPUBindGroup;
  #startTime: number;

  constructor(device: Device, format: GPUTextureFormat) {
    this.#device = device;

    let shaderModule = device.createShaderModule({ label: 'Test Shader', code: SHADER_STR });

    const mat4Size = 4 * 4 * 4; // 4x4 float32 = 16 floats * 4 bytes = 64 bytes
    const sboSize = mat4Size * 3; // model + view + proj = 3 * 64 = 192 bytes

    this.#sboBuffer = device.createBuffer({
      label: 'SBO Buffer',
      size: sboSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const sboBindGroupLayout = device.createBindGroupLayout({
      label: 'SBO Bind Group Layout',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'read-only-storage' },
      }],
    });

    this.#sboBindGroup = device.createBindGroup({
      label: 'SBO Bind Group',
      layout: sboBindGroupLayout,
      entries: [{
        binding: 0,
        resource: { buffer: this.#sboBuffer },
      }],
    });

    let pipelineLayout = device.createPipelineLayout({
      label: 'Test Pipeline Layout',
      bindGroupLayouts: [sboBindGroupLayout],
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
    this.#startTime = Date.now();
  }

  #updateStorageBuffer(canvasWidth: number, canvasHeight: number) {
    const now = (performance.now() - this.#startTime) / 1000.0;

    const sbo: StorageBufferObject = {
      model: mat4.create(),
      view: mat4.create(),
      proj: mat4.create(),
    };

    mat4.fromZRotation(sbo.model, -(now * 90 * Math.PI) / 180);

    const eye = vec3.fromValues(2, 2, 2);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 0, 1);
    mat4.lookAt(sbo.view, eye, center, up);

    const aspect = canvasWidth / canvasHeight;
    mat4.perspective(sbo.proj, Math.PI / 4, aspect, 0.1, 10);

    this.#device.queue.writeBuffer(this.#sboBuffer, 0, flattenSBO(sbo));
  }

  recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView, canvasWidth: number, canvasHeight: number) {
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

    this.#updateStorageBuffer(canvasWidth, canvasHeight);
    passEncoder.setBindGroup(0, this.#sboBindGroup);

    passEncoder.drawIndexed(this.#combinedBuffer.indexCount, 1, 0, 0, 0);
    passEncoder.end();
  }
}
