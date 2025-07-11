import VERT_SHADER_STR from './shaders/shader.vert';
import FRAG_SHADER_STR from './shaders/shader.frag';
import { Program } from '../../dist/program.js';
import { FLOAT, GL } from '../../dist/gl.js';
import { vec2, vec3 } from 'gl-matrix';
import { flattenVertices, Vertex } from './vertex';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

const TEST_VERTICES: Vertex[] = [
  // 첫 번째 삼각형: 좌하단 → 우하단 → 우상단
  {
    pos: vec2.fromValues(-0.5, -0.5),
    color: vec3.fromValues(1, 0, 0),
  },
  {
    pos: vec2.fromValues(0.5, -0.5),
    color: vec3.fromValues(0, 1, 0),
  },
  {
    pos: vec2.fromValues(0.5, 0.5),
    color: vec3.fromValues(0, 0, 1),
  },

  // 두 번째 삼각형: 우상단 → 좌상단 → 좌하단
  {
    pos: vec2.fromValues(0.5, 0.5),
    color: vec3.fromValues(0, 0, 1),
  },
  {
    pos: vec2.fromValues(-0.5, 0.5),
    color: vec3.fromValues(1, 1, 1),
  },
  {
    pos: vec2.fromValues(-0.5, -0.5),
    color: vec3.fromValues(1, 0, 0),
  },
];

export class TestRenderPass {
  #gl: GL;
  #program: Program;
  #vao: WebGLVertexArrayObject;

  constructor(gl: GL) {
    this.#gl = gl;
    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);

    this.#vao = gl.createVertexArray(flattenVertices(TEST_VERTICES));

    // Enable attributes
    const stride = 5 * 4;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, FLOAT, false, stride, 2 * 4);
  }

  recordCommands() {
    this.#gl.clearColor(CLEAR_COLOR);

    this.#program.use();

    this.#gl.bindVertexArray(this.#vao);
    this.#gl.draw(TEST_VERTICES.length, 1);
  }
}
