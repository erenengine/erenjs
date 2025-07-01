import SHADER_STR from './shaders/shader.wgsl';
import { Device } from '../../dist/device.js';
import { flattenVertices, Vertex, VERTEX_DESC } from './vertex';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { flattenUBO, UniformBufferObject } from './ubo';

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

  #bindGroup: GPUBindGroup;
  #computePipeline: GPUComputePipeline;
  #graphicsPipeline: GPURenderPipeline;

  #combinedBuffer: CombinedBuffer;
  #uboBuffer: GPUBuffer;

  #startTime: number;

  constructor(device: Device, format: GPUTextureFormat) {
    this.#device = device;

    let shaderModule = device.createShaderModule({ label: 'Test Shader', code: SHADER_STR });

    const uboSize = 64; // 16 floats * 4 bytes = 64 bytes

    this.#uboBuffer = device.createBuffer({
      label: 'UBO Buffer',
      size: uboSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const mat4Size = 4 * 4 * 4; // 4x4 float32 = 16 floats * 4 bytes = 64 bytes
    const ssboSize = mat4Size * 3; // model + view + proj = 3 * 64 = 192 bytes

    const ssboBuffer = device.createBuffer({
      label: 'SSBO Buffer',
      size: ssboSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = device.createBindGroupLayout({
      label: 'Bind Group Layout',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      }, {
        binding: 1,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'storage' },
      }],
    });

    this.#bindGroup = device.createBindGroup({
      label: 'Bind Group',
      layout: bindGroupLayout,
      entries: [{
        binding: 0,
        resource: { buffer: this.#uboBuffer },
      }, {
        binding: 1,
        resource: { buffer: ssboBuffer },
      }],
    });

    let pipelineLayout = device.createPipelineLayout({
      label: 'Test Pipeline Layout',
      bindGroupLayouts: [bindGroupLayout],
      // WebGPU에서는 pushConstantRanges를 지원하지 않음
    });

    this.#computePipeline = device.createComputePipeline({
      label: 'Test Compute Pipeline',
      layout: pipelineLayout,
      compute: {
        module: shaderModule,
        entryPoint: 'compute_mvp',
      },
    });

    this.#graphicsPipeline = device.createRenderPipeline({
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

  #updateUniformBuffer(canvasWidth: number, canvasHeight: number) {
    const now = (performance.now() - this.#startTime) / 1000.0;

    const ubo: UniformBufferObject = {
      time: now,
      aspect_ratio: canvasWidth / canvasHeight,
      _padding: [0, 0],
    };

    this.#device.queue.writeBuffer(this.#uboBuffer, 0, flattenUBO(ubo));
  }

  recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView, canvasWidth: number, canvasHeight: number) {
    this.#updateUniformBuffer(canvasWidth, canvasHeight);

    const computePassEncoder = encoder.beginComputePass({
      label: 'Test Compute Pass',
    });
    computePassEncoder.setPipeline(this.#computePipeline);
    computePassEncoder.setBindGroup(0, this.#bindGroup);
    computePassEncoder.dispatchWorkgroups(1, 1, 1);
    computePassEncoder.end();

    const renderPassEncoder = encoder.beginRenderPass({
      label: 'Test Render Pass',
      colorAttachments: [{
        view,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: CLEAR_COLOR,
      }],
    });

    renderPassEncoder.setPipeline(this.#graphicsPipeline);
    renderPassEncoder.setVertexBuffer(0, this.#combinedBuffer.buffer, this.#combinedBuffer.vertexOffset);
    renderPassEncoder.setIndexBuffer(this.#combinedBuffer.buffer, 'uint16', this.#combinedBuffer.indexOffset);
    renderPassEncoder.setBindGroup(0, this.#bindGroup);
    renderPassEncoder.drawIndexed(this.#combinedBuffer.indexCount, 1, 0, 0, 0);
    renderPassEncoder.end();
  }
}
