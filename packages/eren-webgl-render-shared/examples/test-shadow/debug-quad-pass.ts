import VERT_SHADER_STR from './shaders/debug_quad.vert';
import FRAG_SHADER_STR from './shaders/debug_quad.frag';
import { Program } from '../../lib/program.js';
import { GL } from '../../lib/gl.js';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

export class DebugQuadPass {
  #gl: GL;
  #program: Program;
  #shadowTexture: WebGLTexture;
  #uShadowMapLoc: WebGLUniformLocation;

  constructor(gl: GL, shadowTexture: WebGLTexture) {
    this.#gl = gl;
    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);
    this.#shadowTexture = shadowTexture;

    const loc = this.#program.getUniformLocation('shadowMap');
    if (!loc) throw new Error('Failed to get uniform location (shadowMap)');
    this.#uShadowMapLoc = loc;
  }

  rebindShadowTexture(shadowTexture: WebGLTexture) {
    this.#shadowTexture = shadowTexture;
  }

  recordCommands() {
    this.#gl.clearColor(CLEAR_COLOR);

    this.#program.use();

    this.#gl.bindRawDepthTexture(0, this.#shadowTexture, this.#uShadowMapLoc);
    this.#gl.draw(3, 1);
  }
}
