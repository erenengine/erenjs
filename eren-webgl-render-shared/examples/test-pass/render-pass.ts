import VERT_SHADER_STR from './shaders/shader.vert';
import FRAG_SHADER_STR from './shaders/shader.frag';
import { Program } from '../../dist/program.js';
import { GL } from '../../dist/gl.js';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

export class TestRenderPass {
  #gl: GL;
  #program: Program;

  constructor(gl: GL) {
    this.#gl = gl;
    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);
  }

  recordCommands() {
    this.#gl.clear(CLEAR_COLOR);
    this.#program.use(); // 너, 사용!
    this.#gl.draw(3, 1);
  }
}
