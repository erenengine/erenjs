import { TestRenderPass } from './render-pass';
import { GL } from '../../lib/gl.js';

export class TestRenderer {
  #renderPass: TestRenderPass;

  constructor(gl: GL) {
    this.#renderPass = new TestRenderPass(gl);
  }

  render() {
    this.#renderPass.recordCommands();
  }
}
