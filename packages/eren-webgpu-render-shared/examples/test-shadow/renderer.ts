import { mat4, vec3 } from 'gl-matrix';
import { Device } from '../../dist/device.js';
import { DebugQuadPass } from './debug-quad-pass';
import { MeshBuffer } from './mesh';
import { ShadowPass } from './shadow-pass';
import { LightUBO, MainUBO } from './ubo';
import { MainPass } from './main-pass';

const DEBUG_QUAD_PASS_ENABLED = false;

export class TestRenderer {
  #device: Device;
  #shadowPass: ShadowPass;
  #debugQuadPass: DebugQuadPass;
  #mainPass: MainPass;
  #startTime: number;

  constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number) {
    this.#device = device;
    this.#shadowPass = new ShadowPass(device, canvasWidth, canvasHeight);
    this.#debugQuadPass = new DebugQuadPass(device, format, this.#shadowPass.shadowTextureView);
    this.#mainPass = new MainPass(device, format, this.#shadowPass.shadowTextureView, canvasWidth, canvasHeight);
    this.#startTime = performance.now();
  }

  resize(canvasWidth: number, canvasHeight: number) {
    this.#shadowPass.resizeShadowTexture(canvasWidth, canvasHeight);
    this.#debugQuadPass.rebindShadowTexture(this.#shadowPass.shadowTextureView);
    this.#mainPass.resizeDepthTexture(canvasWidth, canvasHeight, this.#shadowPass.shadowTextureView);
  }

  render(view: GPUTextureView, meshes: MeshBuffer[], canvasWidth: number, canvasHeight: number) {
    const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });

    const time = (performance.now() - this.#startTime) / 1000.0;
    const speed = 0.2;
    const radius = 8.0;
    const height = 6.0;

    const lightX = radius * Math.cos(speed * 2.0 * time);
    const lightZ = radius * Math.sin(speed * 2.0 * time);
    const lightPos = vec3.fromValues(lightX, height, lightZ);

    const lightProj = mat4.create();
    mat4.ortho(lightProj, -10, 10, -10, 10, -10, 20);

    const lightView = mat4.create();
    mat4.lookAt(lightView, lightPos, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    const lightViewProj = mat4.create();
    mat4.multiply(lightViewProj, lightProj, lightView);

    this.#shadowPass.updateShadowUBO({ lightViewProj });
    this.#shadowPass.recordCommands(encoder, meshes);

    if (DEBUG_QUAD_PASS_ENABLED) {
      this.#debugQuadPass.recordCommands(encoder, view);
    } else {
      // Camera follows a slower orbit opposite to the light
      const camPos = vec3.fromValues(
        radius * Math.cos(speed * time),
        height,
        radius * Math.sin(speed * time),
      );

      const viewMat = mat4.create();
      mat4.lookAt(viewMat, camPos, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

      const projMat = mat4.create();
      mat4.perspective(
        projMat,
        (45 * Math.PI) / 180,
        canvasWidth / canvasHeight,
        0.1,
        100.0,
      );

      // UBO updates
      const mainUBO: MainUBO = {
        model: mat4.create(), // identity
        view: viewMat,
        proj: projMat,
        lightViewProj,
      } as MainUBO; // casting because structural typing

      this.#mainPass.updateMainUBO(mainUBO);

      const lightDir = vec3.create();
      vec3.subtract(lightDir, vec3.fromValues(0, 0, 0), lightPos);
      vec3.normalize(lightDir, lightDir);

      const lightUBO: LightUBO = {
        direction: lightDir,
        color: vec3.fromValues(1, 1, 1),
      } as LightUBO;

      this.#mainPass.updateLightUBO(lightUBO);

      // Record main scene draw calls
      this.#mainPass.recordCommands(encoder, view, meshes);
    }

    this.#device.queue.submit([encoder.finish()]);
  }
}
