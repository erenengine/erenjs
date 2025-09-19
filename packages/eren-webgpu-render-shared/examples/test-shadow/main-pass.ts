import { Device } from '../../lib/device.js';
import { MeshBuffer } from './mesh';
import SHADER_STR from './shaders/main.wgsl';
import { VERTEX_DESC } from './vertex';
import {
  flattenMainUBO,
  flattenLightUBO,
  MainUBO,
  LightUBO,
} from './ubo';

const CLEAR_COLOR: GPUColorDict = {
  r: 0.1921,
  g: 0.302,
  b: 0.4745,
  a: 1,
};

const CLEAR_DEPTH = 1.0;

export class MainPass {
  #device: Device;
  #pipeline: GPURenderPipeline;

  #mainUBOBuffer: GPUBuffer;
  #lightUBOBuffer: GPUBuffer;
  #bindGroupMain: GPUBindGroup;

  #bindGroupLayoutShadow: GPUBindGroupLayout;
  #shadowSampler: GPUSampler;
  #bindGroupShadow: GPUBindGroup;

  #sceneDepthView: GPUTextureView;

  constructor(
    device: Device,
    surfaceFormat: GPUTextureFormat,
    shadowTextureView: GPUTextureView,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this.#device = device;

    const shaderModule = device.createShaderModule({
      label: 'Main Shader',
      code: SHADER_STR,
    });

    const bindGroupLayoutMain = device.createBindGroupLayout({
      label: 'Main UBO Layout',
      entries: [
        {
          binding: 0, // MainUBO
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'uniform' },
        },
        {
          binding: 1, // LightUBO
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
      ],
    });

    this.#bindGroupLayoutShadow = device.createBindGroupLayout({
      label: 'Shadow Sampler Layout',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { viewDimension: '2d', multisampled: false, sampleType: 'depth' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: 'comparison' },
        },
      ],
    });

    this.#shadowSampler = device.createSampler({
      label: 'Shadow Map Sampler',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      addressModeW: 'clamp-to-edge',
      minFilter: 'nearest',
      magFilter: 'nearest',
      mipmapFilter: 'nearest',
      compare: 'less',
    });

    const mainUBOSize = 4 * 4 * 4 * 4; // 4 mat4 = 256 B (adjust to your struct)
    const lightUBOSize = 4 * 4 * 4; // 1 mat4 or vec4x4 = 64 B (adjust accordingly)

    this.#mainUBOBuffer = device.createBuffer({
      label: 'MainUBO',
      size: mainUBOSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.#lightUBOBuffer = device.createBuffer({
      label: 'LightUBO',
      size: lightUBOSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.#bindGroupMain = device.createBindGroup({
      label: 'Main Bind Group',
      layout: bindGroupLayoutMain,
      entries: [
        { binding: 0, resource: { buffer: this.#mainUBOBuffer } },
        { binding: 1, resource: { buffer: this.#lightUBOBuffer } },
      ],
    });

    this.#bindGroupShadow = this.#createShadowBindGroup(shadowTextureView);

    const pipelineLayout = device.createPipelineLayout({
      label: 'Main Pipeline Layout',
      bindGroupLayouts: [bindGroupLayoutMain, this.#bindGroupLayoutShadow],
    });

    this.#pipeline = device.createRenderPipeline({
      label: 'Main Pipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [VERTEX_DESC],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [
          {
            format: surfaceFormat,
            blend: {
              color: { operation: 'add', srcFactor: 'one', dstFactor: 'zero' },
              alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'zero' }
            },
            writeMask: GPUColorWrite.ALL,
          },
        ],
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

    this.#sceneDepthView = this.#createDepthTextureView(canvasWidth, canvasHeight);
  }

  updateMainUBO(ubo: MainUBO) {
    this.#device.queue.writeBuffer(this.#mainUBOBuffer, 0, flattenMainUBO(ubo));
  }

  updateLightUBO(ubo: LightUBO) {
    this.#device.queue.writeBuffer(this.#lightUBOBuffer, 0, flattenLightUBO(ubo));
  }

  resizeDepthTexture(
    width: number,
    height: number,
    shadowTextureView: GPUTextureView,
  ) {
    this.#bindGroupShadow = this.#createShadowBindGroup(shadowTextureView);
    this.#sceneDepthView = this.#createDepthTextureView(width, height);
  }

  recordCommands(
    encoder: GPUCommandEncoder,
    surfaceView: GPUTextureView,
    meshes: MeshBuffer[],
  ) {
    const passEncoder = encoder.beginRenderPass({
      label: 'Main Render Pass',
      colorAttachments: [
        {
          view: surfaceView,
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: CLEAR_COLOR,
        },
      ],
      depthStencilAttachment: {
        view: this.#sceneDepthView,
        depthClearValue: CLEAR_DEPTH,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    passEncoder.setPipeline(this.#pipeline);
    passEncoder.setBindGroup(0, this.#bindGroupMain);
    passEncoder.setBindGroup(1, this.#bindGroupShadow);

    for (const mesh of meshes) {
      passEncoder.setVertexBuffer(0, mesh.buffer, mesh.vertexOffset);
      passEncoder.setIndexBuffer(mesh.buffer, 'uint16', mesh.indexOffset);
      passEncoder.drawIndexed(mesh.indexCount, 1, 0, 0, 0);
    }

    passEncoder.end();
  }

  #createShadowBindGroup(shadowTextureView: GPUTextureView): GPUBindGroup {
    return this.#device.createBindGroup({
      label: 'Shadow Bind Group',
      layout: this.#bindGroupLayoutShadow,
      entries: [
        { binding: 0, resource: shadowTextureView },
        { binding: 1, resource: this.#shadowSampler },
      ],
    });
  }

  #createDepthTextureView(
    width: number,
    height: number,
  ) {
    const depthTexture = this.#device.createTexture({
      label: 'Scene Depth Texture',
      size: { width, height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    return depthTexture.createView();
  }
}
