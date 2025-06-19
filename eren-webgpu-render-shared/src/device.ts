import { Adapter } from './adapter.js';

export class Device {
  #device: GPUDevice;
  #queue: GPUQueue;

  private constructor(device: GPUDevice, queue: GPUQueue) {
    this.#device = device;
    this.#queue = queue;
  }

  static async create(adapter: Adapter): Promise<Device> {
    const device = await adapter.requestDevice();
    return new Device(device, device.queue);
  }
}
