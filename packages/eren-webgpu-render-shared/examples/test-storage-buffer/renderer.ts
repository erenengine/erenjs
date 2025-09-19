import { Device } from '../../lib/device.js';
import { TestRenderPass } from './render-pass';

export class TestRenderer {
  #device: Device;
  #renderPass: TestRenderPass;

  constructor(device: Device, format: GPUTextureFormat) {
    this.#device = device;
    this.#renderPass = new TestRenderPass(device, format);
  }

  render(view: GPUTextureView, canvasWidth: number, canvasHeight: number) {
    const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });
    this.#renderPass.recordCommands(encoder, view, canvasWidth, canvasHeight);
    this.#device.queue.submit([encoder.finish()]);
  }
}
