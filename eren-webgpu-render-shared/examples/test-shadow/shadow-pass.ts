import { Device } from '../../dist/device.js';
import { MeshBuffer } from './mesh';
import SHADER_STR from './shaders/shadow.wgsl';
import { flattenShadowUBO, ShadowUBO } from './ubo';
import { VERTEX_DESC } from './vertex';

const CLEAR_DEPTH = 1.0;

export class ShadowPass {
  shadowTextureView: GPUTextureView;

  #device: Device;
  #uniformBuffer: GPUBuffer;
  #bindGroup: GPUBindGroup;
  #pipeline: GPURenderPipeline;

  constructor(device: Device, canvasWidth: number, canvasHeight: number) {
    this.#device = device;

    const shaderModule = device.createShaderModule({ label: 'Shadow Shader', code: SHADER_STR });

    const mat4Size = 4 * 4 * 4; // 4x4 float32 = 16 floats * 4 bytes = 64 bytes
    const uboSize = mat4Size; // lightViewProj = 64 bytes

    this.#uniformBuffer = device.createBuffer({
      label: 'Shadow UBO',
      size: uboSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = device.createBindGroupLayout({
      label: 'Shadow Bind Group Layout',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      }],
    });

    this.#bindGroup = device.createBindGroup({
      label: 'Shadow Bind Group',
      layout: bindGroupLayout,
      entries: [{
        binding: 0,
        resource: { buffer: this.#uniformBuffer },
      }],
    });

    const pipelineLayout = device.createPipelineLayout({
      label: 'Shadow Pipeline Layout',
      bindGroupLayouts: [bindGroupLayout],
    });

    this.#pipeline = device.createRenderPipeline({
      label: 'Shadow Pipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [VERTEX_DESC],
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
        depthBias: 2,
        depthBiasSlopeScale: 4,
        depthBiasClamp: 0,
      },
    });

    this.shadowTextureView = this.#createShadowTextureView(canvasWidth, canvasHeight);
  }

  #createShadowTextureView(width: number, height: number) {
    const shadowTexture = this.#device.createTexture({
      label: 'Shadow Depth Texture',
      size: { width, height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    return shadowTexture.createView();
  }

  resizeShadowTexture(width: number, height: number) {
    this.shadowTextureView = this.#createShadowTextureView(width, height);
  }

  updateShadowUBO(shadowUBO: ShadowUBO) {
    this.#device.queue.writeBuffer(this.#uniformBuffer, 0, flattenShadowUBO(shadowUBO));
  }

  recordCommands(encoder: GPUCommandEncoder, meshes: MeshBuffer[]) {
    const passEncoder = encoder.beginRenderPass({
      colorAttachments: [],
      depthStencilAttachment: {
        view: this.shadowTextureView,
        depthClearValue: CLEAR_DEPTH,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    passEncoder.setPipeline(this.#pipeline);
    passEncoder.setBindGroup(0, this.#bindGroup);

    for (const mesh of meshes) {
      passEncoder.setVertexBuffer(0, mesh.buffer, mesh.vertexOffset);
      passEncoder.setIndexBuffer(mesh.buffer, 'uint16', mesh.indexOffset);
      passEncoder.drawIndexed(mesh.indexCount, 1, 0, 0, 0);
    }

    passEncoder.end();
  }
}
