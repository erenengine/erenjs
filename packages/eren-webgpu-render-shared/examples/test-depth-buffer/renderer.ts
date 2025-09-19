import { Device } from '../../lib/device.js';
import { TestRenderPass } from './render-pass';

export class TestRenderer {
  #device: Device;
  #renderPass: TestRenderPass;

  constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number) {
    this.#device = device;
    this.#renderPass = new TestRenderPass(device, format, canvasWidth, canvasHeight);
  }

  resize(canvasWidth: number, canvasHeight: number) {
    this.#renderPass.resizeDepthTexture(canvasWidth, canvasHeight);
  }

  render(view: GPUTextureView, canvasWidth: number, canvasHeight: number) {
    const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });
    this.#renderPass.recordCommands(encoder, view, canvasWidth, canvasHeight);
    this.#device.queue.submit([encoder.finish()]);
  }
}
