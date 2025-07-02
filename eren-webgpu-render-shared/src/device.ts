import { Adapter } from './adapter.js';
import { Context } from './context.js';

export class Device {
  #device: GPUDevice;

  queue: GPUQueue;

  private constructor(device: GPUDevice, queue: GPUQueue) {
    this.#device = device;
    this.queue = queue;
  }

  static async create(adapter: Adapter, context: Context, format: GPUTextureFormat): Promise<Device> {
    const device = await adapter.requestDevice();
    context.configure({ device, format, alphaMode: 'opaque' });
    return new Device(device, device.queue);
  }

  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return this.#device.createShaderModule(descriptor);
  }

  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    return this.#device.createPipelineLayout(descriptor);
  }

  createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return this.#device.createComputePipeline(descriptor);
  }

  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    return this.#device.createRenderPipeline(descriptor);
  }

  createCommandEncoder(descriptor: GPUCommandEncoderDescriptor): GPUCommandEncoder {
    return this.#device.createCommandEncoder(descriptor);
  }

  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer {
    return this.#device.createBuffer(descriptor);
  }

  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return this.#device.createBindGroupLayout(descriptor);
  }

  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    return this.#device.createBindGroup(descriptor);
  }

  createTexture(descriptor: GPUTextureDescriptor): GPUTexture {
    return this.#device.createTexture(descriptor);
  }
}
