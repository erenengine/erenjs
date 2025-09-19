import { Device } from '../../lib/device.js';
import SHADER_STR from './shaders/debug_quad.wgsl';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

export class DebugQuadPass {
  #device: Device;
  #bindGroupLayout: GPUBindGroupLayout;
  #sampler: GPUSampler;
  #bindGroup: GPUBindGroup;
  #pipeline: GPURenderPipeline;

  constructor(device: Device, format: GPUTextureFormat, shadowTextureView: GPUTextureView) {
    this.#device = device;

    const shaderModule = device.createShaderModule({
      label: 'Debug Quad Shader',
      code: SHADER_STR
    });

    this.#bindGroupLayout = device.createBindGroupLayout({
      label: 'Debug Bind Group Layout',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            sampleType: 'depth',
            viewDimension: '2d',
            multisampled: false,
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {
            type: 'comparison',
          },
        },
      ],
    });

    this.#sampler = device.createSampler({
      label: 'Debug Quad Sampler',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      addressModeW: 'clamp-to-edge',
      compare: 'less',
    });

    this.#bindGroup = this.#createBindGroup(shadowTextureView);

    const pipelineLayout = device.createPipelineLayout({
      label: 'Debug Pipeline Layout',
      bindGroupLayouts: [this.#bindGroupLayout],
    });

    this.#pipeline = device.createRenderPipeline({
      label: 'Debug Quad Pipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format }],
      },
    });
  }

  rebindShadowTexture(shadowTextureView: GPUTextureView) {
    this.#bindGroup = this.#createBindGroup(shadowTextureView);
  }

  #createBindGroup(shadowTextureView: GPUTextureView): GPUBindGroup {
    return this.#device.createBindGroup({
      label: 'Debug Bind Group',
      layout: this.#bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: shadowTextureView,
        },
        {
          binding: 1,
          resource: this.#sampler,
        },
      ],
    });
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
    passEncoder.setBindGroup(0, this.#bindGroup);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.end();
  }
}
