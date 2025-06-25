import { TestRenderPass } from './test-render-pass';
import { GL } from '../../dist/gl.js';

export class TestRenderer {
  #renderPass: TestRenderPass;

  constructor(gl: GL) {
    this.#renderPass = new TestRenderPass(gl);
  }

  render() {
    this.#renderPass.recordCommands();
  }
}
