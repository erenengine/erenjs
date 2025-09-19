// src/passes/main.ts
import VERT_SHADER_STR from './shaders/main.vert';
import FRAG_SHADER_STR from './shaders/main.frag';

import { Program } from '../../lib/program.js';
import { GL, LESS } from '../../lib/gl.js';

import { MainUBO, LightUBO } from './ubo';
import { MeshBuffer } from './mesh';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };
const CLEAR_DEPTH = 1.0;

export class MainPass {
  #gl: GL;
  #program: Program;

  #shadowTexture: WebGLTexture;

  #uModelLoc: WebGLUniformLocation;
  #uViewLoc: WebGLUniformLocation;
  #uProjLoc: WebGLUniformLocation;
  #uLightViewProjLoc: WebGLUniformLocation;
  #uLightDirLoc: WebGLUniformLocation;
  #uLightColorLoc: WebGLUniformLocation;
  #uShadowMapLoc: WebGLUniformLocation;
  #uTextureLoc: WebGLUniformLocation;

  #mainUBO?: MainUBO;
  #lightUBO?: LightUBO;

  #texture: WebGLTexture;

  constructor(gl: GL, shadowTexture: WebGLTexture, bitmap: ImageBitmap) {
    this.#texture = gl.createImageTexture(bitmap);

    this.#gl = gl;
    this.#shadowTexture = shadowTexture;

    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);

    this.#uModelLoc = this.#program.getUniformLocation('uModel');
    this.#uViewLoc = this.#program.getUniformLocation('uView');
    this.#uProjLoc = this.#program.getUniformLocation('uProj');
    this.#uLightViewProjLoc = this.#program.getUniformLocation('uLightViewProj');
    this.#uLightDirLoc = this.#program.getUniformLocation('uLightDirection');
    this.#uLightColorLoc = this.#program.getUniformLocation('uLightColor');
    this.#uShadowMapLoc = this.#program.getUniformLocation('shadowMap');
    this.#uTextureLoc = this.#program.getUniformLocation('uTextureSampler');

    gl.enableDepthTest();
    gl.depthFunc(LESS);
  }

  rebindShadowTexture(shadowTexture: WebGLTexture) {
    this.#shadowTexture = shadowTexture;
  }

  updateMainUBO(ubo: MainUBO) { this.#mainUBO = ubo; }
  updateLightUBO(ubo: LightUBO) { this.#lightUBO = ubo; }

  recordCommands(meshes: MeshBuffer[]) {
    const gl = this.#gl;

    gl.clearColor(CLEAR_COLOR);
    gl.clearDepth(CLEAR_DEPTH);

    this.#program.use();

    if (this.#mainUBO) {
      gl.uniformMatrix4fv(this.#uModelLoc, false, this.#mainUBO.model);
      gl.uniformMatrix4fv(this.#uViewLoc, false, this.#mainUBO.view);
      gl.uniformMatrix4fv(this.#uProjLoc, false, this.#mainUBO.proj);
      gl.uniformMatrix4fv(this.#uLightViewProjLoc, false, this.#mainUBO.lightViewProj);
    }

    if (this.#lightUBO) {
      gl.uniform3fv(this.#uLightDirLoc, this.#lightUBO.direction);
      gl.uniform3fv(this.#uLightColorLoc, this.#lightUBO.color);
    }

    gl.bindRawDepthTexture(0, this.#shadowTexture, this.#uShadowMapLoc);
    gl.bindImageTexture(1, this.#texture, this.#uTextureLoc);

    for (const mesh of meshes) {
      gl.bindVertexArray(mesh.vao);
      gl.drawElements(mesh.indexCount);
    }
  }
}
