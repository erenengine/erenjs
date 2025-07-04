import SHADER_STR from './shaders/shader.wgsl';
import { Device } from '../../dist/device.js';
import { flattenVertices, Vertex, VERTEX_DESC } from './vertex';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { flattenUBO, UniformBufferObject } from './ubo';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };
const CLEAR_DEPTH = 1.0;

const TEST_VERTICES: Vertex[] = [
  {
    pos: vec3.fromValues(-0.5, -0.5, 0.0),
    color: vec3.fromValues(1.0, 0.0, 0.0),
    tex_coords: vec2.fromValues(0.0, 0.0),
  },
  {
    pos: vec3.fromValues(0.5, -0.5, 0.0),
    color: vec3.fromValues(0.0, 1.0, 0.0),
    tex_coords: vec2.fromValues(1.0, 0.0),
  },
  {
    pos: vec3.fromValues(0.5, 0.5, 0.0),
    color: vec3.fromValues(0.0, 0.0, 1.0),
    tex_coords: vec2.fromValues(1.0, 1.0),
  },
  {
    pos: vec3.fromValues(-0.5, 0.5, 0.0),
    color: vec3.fromValues(1.0, 1.0, 1.0),
    tex_coords: vec2.fromValues(0.0, 1.0),
  },
  {
    pos: vec3.fromValues(-0.5, -0.5, -0.5),
    color: vec3.fromValues(1.0, 0.0, 0.0),
    tex_coords: vec2.fromValues(0.0, 0.0),
  },
  {
    pos: vec3.fromValues(0.5, -0.5, -0.5),
    color: vec3.fromValues(0.0, 1.0, 0.0),
    tex_coords: vec2.fromValues(1.0, 0.0),
  },
  {
    pos: vec3.fromValues(0.5, 0.5, -0.5),
    color: vec3.fromValues(0.0, 0.0, 1.0),
    tex_coords: vec2.fromValues(1.0, 1.0),
  },
  {
    pos: vec3.fromValues(-0.5, 0.5, -0.5),
    color: vec3.fromValues(1.0, 1.0, 1.0),
    tex_coords: vec2.fromValues(0.0, 1.0),
  },
];

const TEST_INDICES: number[] = [0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4];

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
  #depthView: GPUTextureView;

  #combinedBuffer: CombinedBuffer;
  #uboBuffer: GPUBuffer;
  #uboBindGroup: GPUBindGroup;

  #startTime: number;

  constructor(
    device: Device,
    format: GPUTextureFormat,
    canvasWidth: number,
    canvasHeight: number,
    bitmap: ImageBitmap,
  ) {
    const texture = device.createTexture({
      label: 'Test Texture',
      size: { width: bitmap.width, height: bitmap.height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture },
      { width: bitmap.width, height: bitmap.height },
    );

    const textureImageView = texture.createView();
    const textureSampler = device.createSampler({
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    this.#device = device;

    const shaderModule = device.createShaderModule({ label: 'Test Shader', code: SHADER_STR });

    const mat4Size = 4 * 4 * 4; // 4x4 float32 = 16 floats * 4 bytes = 64 bytes
    const uboSize = mat4Size * 3; // model + view + proj = 3 * 64 = 192 bytes

    this.#uboBuffer = device.createBuffer({
      label: 'UBO Buffer',
      size: uboSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uboBindGroupLayout = device.createBindGroupLayout({
      label: 'UBO Bind Group Layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    this.#uboBindGroup = device.createBindGroup({
      label: 'UBO Bind Group',
      layout: uboBindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.#uboBuffer } },
        { binding: 1, resource: textureImageView },
        { binding: 2, resource: textureSampler },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      label: 'Test Pipeline Layout',
      bindGroupLayouts: [uboBindGroupLayout],
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
        cullMode: 'back',
        frontFace: 'ccw',
        topology: 'triangle-list',
      },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
    });

    this.#depthView = this.#createDepthTextureView(canvasWidth, canvasHeight);
    this.#combinedBuffer = createCombinedBuffer(device);
    this.#startTime = Date.now();
  }

  #createDepthTextureView(width: number, height: number) {
    const depthTexture = this.#device.createTexture({
      label: 'Depth Texture',
      size: { width, height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    return depthTexture.createView();
  }

  resizeDepthTexture(width: number, height: number) {
    this.#depthView = this.#createDepthTextureView(width, height);
  }

  #updateUniformBuffer(canvasWidth: number, canvasHeight: number) {
    const now = (performance.now() - this.#startTime) / 1000.0;

    const ubo: UniformBufferObject = {
      model: mat4.create(),
      view: mat4.create(),
      proj: mat4.create(),
    };

    mat4.fromZRotation(ubo.model, -(now * 90 * Math.PI) / 180);

    const eye = vec3.fromValues(2, 2, 2);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 0, 1);
    mat4.lookAt(ubo.view, eye, center, up);

    const aspect = canvasWidth / canvasHeight;
    mat4.perspective(ubo.proj, Math.PI / 4, aspect, 0.1, 10);

    this.#device.queue.writeBuffer(this.#uboBuffer, 0, flattenUBO(ubo));
  }

  recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView, canvasWidth: number, canvasHeight: number) {
    const passEncoder = encoder.beginRenderPass({
      colorAttachments: [{
        view,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: CLEAR_COLOR,
      }],
      depthStencilAttachment: {
        view: this.#depthView,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        depthClearValue: CLEAR_DEPTH,
      },
    });

    passEncoder.setPipeline(this.#pipeline);

    passEncoder.setVertexBuffer(0, this.#combinedBuffer.buffer, this.#combinedBuffer.vertexOffset);
    passEncoder.setIndexBuffer(this.#combinedBuffer.buffer, 'uint16', this.#combinedBuffer.indexOffset);

    this.#updateUniformBuffer(canvasWidth, canvasHeight);
    passEncoder.setBindGroup(0, this.#uboBindGroup);

    passEncoder.drawIndexed(this.#combinedBuffer.indexCount, 1, 0, 0, 0);
    passEncoder.end();
  }
}
