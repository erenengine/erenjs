import { Device } from '../../dist/device.js';
import { TestRenderPass } from './render-pass';

export class TestRenderer {
  #device: Device;
  #renderPass: TestRenderPass;

  constructor(device: Device, format: GPUTextureFormat) {
    this.#device = device;
    this.#renderPass = new TestRenderPass(device, format);
  }

  render(view: GPUTextureView) {
    const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });
    this.#renderPass.recordCommands(encoder, view);
    this.#device.queue.submit([encoder.finish()]);
  }
}
