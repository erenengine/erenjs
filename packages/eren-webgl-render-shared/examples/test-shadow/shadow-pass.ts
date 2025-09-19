import VERT_SHADER_STR from './shaders/shadow.vert';
import { Program } from '../../lib/program.js';
import { FLOAT, GL, LESS } from '../../lib/gl.js';
import { ShadowUBO } from './ubo';
import { MeshBuffer } from './mesh';

const CLEAR_DEPTH = 1.0;

export class ShadowPass {
  shadowTexture: WebGLTexture;

  #gl: GL;
  #program: Program;
  #uLightViewProjLoc: WebGLUniformLocation;
  #fbo: WebGLFramebuffer;
  #shadowUBO?: ShadowUBO;

  constructor(gl: GL, canvasWidth: number, canvasHeight: number) {
    this.#gl = gl;
    this.#program = new Program(gl, VERT_SHADER_STR);

    this.#uLightViewProjLoc = this.#program.getUniformLocation('uLightViewProj');

    gl.enableDepthTest();
    gl.depthFunc(LESS);

    this.shadowTexture = gl.createDepthTexture(canvasWidth, canvasHeight);
    this.#fbo = gl.createDepthFramebuffer(this.shadowTexture);
  }

  resizeShadowTexture(width: number, height: number) {
    const gl = this.#gl;

    gl.deleteTexture(this.shadowTexture);
    gl.deleteFramebuffer(this.#fbo);

    this.shadowTexture = gl.createDepthTexture(width, height);
    this.#fbo = gl.createDepthFramebuffer(this.shadowTexture);
  }

  updateShadowUBO(ubo: ShadowUBO) {
    this.#shadowUBO = ubo;
  }

  recordCommands(meshes: MeshBuffer[]) {
    const gl = this.#gl;

    gl.bindDepthFramebuffer(this.#fbo);
    gl.clearDepth(CLEAR_DEPTH);

    this.#program.use();
    if (this.#shadowUBO) gl.uniformMatrix4fv(this.#uLightViewProjLoc, false, this.#shadowUBO.lightViewProj);

    for (const mesh of meshes) {
      gl.bindVertexArray(mesh.vao);
      gl.drawElements(mesh.indexCount);
    }

    gl.restoreFramebufferDefaultState();
  }
}
