import { mat4, vec3 } from 'gl-matrix';
import { Device } from '../../dist/device.js';
import { DebugQuadPass } from './debug-quad-pass';
import { MeshBuffer } from './mesh';
import { ShadowPass } from './shadow-pass';

export class TestRenderer {
  #device: Device;
  #shadowPass: ShadowPass;
  #debugQuadPass: DebugQuadPass;
  #startTime: number;

  constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number) {
    this.#device = device;
    this.#shadowPass = new ShadowPass(device, canvasWidth, canvasHeight);
    this.#debugQuadPass = new DebugQuadPass(device, format, this.#shadowPass.shadowTextureView);
    this.#startTime = Date.now();
  }

  resize(canvasWidth: number, canvasHeight: number) {
    this.#shadowPass.resizeShadowTexture(canvasWidth, canvasHeight);
    this.#debugQuadPass.rebindShadowTexture(this.#shadowPass.shadowTextureView);
  }

  render(view: GPUTextureView, meshes: MeshBuffer[]) {
    const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });

    const now = (performance.now() - this.#startTime) / 1000.0;
    const speed = 0.2;
    const radius = 8.0;
    const height = 6.0;

    const lightX = radius * Math.cos(speed * 2.0 * now);
    const lightZ = -radius * Math.sin(speed * 2.0 * now);
    const lightPos = vec3.fromValues(lightX, height, lightZ);

    const lightProj = mat4.create();
    mat4.ortho(lightProj, -10, 10, -10, 10, -10, 20);

    const lightView = mat4.create();
    mat4.lookAt(lightView, lightPos, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    const lightViewProj = mat4.create();
    mat4.multiply(lightViewProj, lightProj, lightView);

    this.#shadowPass.updateShadowUBO({ lightViewProj });
    this.#shadowPass.recordCommands(encoder, meshes);
    this.#debugQuadPass.recordCommands(encoder, view,);
    this.#device.queue.submit([encoder.finish()]);
  }
}
