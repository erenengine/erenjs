import { TestRenderPass } from './render-pass';
import { GL } from '../../lib/gl.js';

export class TestRenderer {
  #renderPass: TestRenderPass;

  constructor(gl: GL, bitmap: ImageBitmap) {
    this.#renderPass = new TestRenderPass(gl, bitmap);
  }

  render(canvasWidth: number, canvasHeight: number) {
    this.#renderPass.recordCommands(canvasWidth, canvasHeight);
  }
}
