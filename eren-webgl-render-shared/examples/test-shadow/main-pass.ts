// src/passes/main.ts
import VERT_SHADER_STR from './shaders/main.vert';
import FRAG_SHADER_STR from './shaders/main.frag';

import { Program } from '../../dist/program.js';
import { GL, LESS } from '../../dist/gl.js';

import { MainUBO, LightUBO } from './ubo';
import { MeshBuffer } from './mesh';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };
const CLEAR_DEPTH = 1.0;

export class MainPass {
  // ────────────── private fields ───────────────────────────────────────────────
  #gl: GL;
  #program: Program;

  #shadowTexture: WebGLTexture;

  // uniform locations
  #uModelLoc: WebGLUniformLocation;
  #uViewLoc: WebGLUniformLocation;
  #uProjLoc: WebGLUniformLocation;
  #uLightViewProjLoc: WebGLUniformLocation;
  #uLightDirLoc: WebGLUniformLocation;
  #uLightColorLoc: WebGLUniformLocation;
  #uShadowMapLoc: WebGLUniformLocation;

  // cached UBO data (갱신 후 draw 때 사용)
  #mainUBO?: MainUBO;
  #lightUBO?: LightUBO;

  // ─────────────────────────────────────────────────────────────────────────────
  constructor(gl: GL, shadowTexture: WebGLTexture) {
    this.#gl = gl;
    this.#shadowTexture = shadowTexture;

    // 쉐이더 프로그램 생성
    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);

    // 유니폼 위치 캐싱
    const loc = (name: string) => {
      const l = this.#program.getUniformLocation(name);
      if (!l) throw new Error(`Failed to get uniform location (${name})`);
      return l;
    };
    this.#uModelLoc        = loc('uModel');
    this.#uViewLoc         = loc('uView');
    this.#uProjLoc         = loc('uProj');
    this.#uLightViewProjLoc= loc('uLightViewProj');
    this.#uLightDirLoc     = loc('uLightDirection');
    this.#uLightColorLoc   = loc('uLightColor');
    this.#uShadowMapLoc    = loc('shadowMap');

    // 깊이 테스트 설정
    gl.enableDepthTest();
    gl.depthFunc(LESS);
  }

  /** ShadowMap이 다시 만들어졌을 때 재결합 */
  rebindShadowTexture(shadowTexture: WebGLTexture) {
    this.#shadowTexture = shadowTexture;
  }

  // ────────────── UBO 업데이트 ────────────────────────────────────────────────
  updateMainUBO(ubo: MainUBO)  { this.#mainUBO  = ubo; }
  updateLightUBO(ubo: LightUBO){ this.#lightUBO = ubo; }

  // ────────────── 렌더 패스 기록 ──────────────────────────────────────────────
  recordCommands(meshes: MeshBuffer[]) {
    const gl = this.#gl;

    // 기본 FBO 정리
    gl.clearColor(CLEAR_COLOR);
    gl.clearDepth(CLEAR_DEPTH);

    // 프로그램 사용
    this.#program.use();

    // 프레임 상수(UBO) 업로드
    if (this.#mainUBO) {
      gl.uniformMatrix4fv(this.#uModelLoc,         false, this.#mainUBO.model);
      gl.uniformMatrix4fv(this.#uViewLoc,          false, this.#mainUBO.view);
      gl.uniformMatrix4fv(this.#uProjLoc,          false, this.#mainUBO.proj);
      gl.uniformMatrix4fv(this.#uLightViewProjLoc, false, this.#mainUBO.lightViewProj);
    }

    if (this.#lightUBO) {
      gl.uniform3fv(this.#uLightDirLoc,   this.#lightUBO.direction);
      gl.uniform3fv(this.#uLightColorLoc, this.#lightUBO.color);
    }

    // 그림자 맵 텍스처 결합 (RAW depth + comparison sampler)
    const prevCompare = gl.bindTextureToSamplerForRawDepth(
      this.#shadowTexture,
      this.#uShadowMapLoc,
    );

    // 모든 메시에 대해 그리기
    for (const mesh of meshes) {
      gl.bindVertexArray(mesh.vao);
      gl.drawElements(mesh.indexCount);
    }

    // 상태 복구
    gl.restoreTextureState(prevCompare);
  }
}
