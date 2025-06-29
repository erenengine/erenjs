import { TestRenderPass } from './render-pass';
import { GL } from '../../dist/gl.js';

export class TestRenderer {
  #renderPass: TestRenderPass;

  constructor(gl: GL) {
    this.#renderPass = new TestRenderPass(gl);
  }

  render(canvasWidth: number, canvasHeight: number) {
    this.#renderPass.recordCommands(canvasWidth, canvasHeight);
  }
}
