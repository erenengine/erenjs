import VERT_SHADER_STR from './shaders/shader.vert';
import FRAG_SHADER_STR from './shaders/shader.frag';
import { Program } from '../../dist/program.js';
import { ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, FLOAT, GL, STATIC_DRAW } from '../../dist/gl.js';
import { UniformBufferObject } from './ubo';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { flattenVertices, Vertex } from './vertex';

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

const TEST_VERTICES: Vertex[] = [{
  pos: vec2.fromValues(-0.5, -0.5),
  color: vec3.fromValues(1, 0, 0),
}, {
  pos: vec2.fromValues(0.5, -0.5),
  color: vec3.fromValues(0, 1, 0),
}, {
  pos: vec2.fromValues(0.5, 0.5),
  color: vec3.fromValues(0, 0, 1),
}, {
  pos: vec2.fromValues(-0.5, 0.5),
  color: vec3.fromValues(1, 1, 1),
}];

const TEST_INDICES: number[] = [0, 1, 2, 2, 3, 0];

export class TestRenderPass {
  #gl: GL;
  #program: Program;
  #vao: WebGLVertexArrayObject;
  #uModelLoc: WebGLUniformLocation;
  #uViewLoc: WebGLUniformLocation;
  #uProjLoc: WebGLUniformLocation;
  #startTime: number;

  constructor(gl: GL) {
    this.#gl = gl;
    this.#program = new Program(gl, VERT_SHADER_STR, FRAG_SHADER_STR);

    this.#vao = gl.createVertexArray(flattenVertices(TEST_VERTICES), new Uint16Array(TEST_INDICES));

    // Enable attributes
    const stride = 5 * 4;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, FLOAT, false, stride, 2 * 4);

    this.#uModelLoc = this.#program.getUniformLocation('uModel');
    this.#uViewLoc = this.#program.getUniformLocation('uView');
    this.#uProjLoc = this.#program.getUniformLocation('uProj');

    this.#startTime = Date.now();
  }

  #getUBO(canvasWidth: number, canvasHeight: number) {
    const now = (performance.now() - this.#startTime) / 1000.0;

    const ubo: UniformBufferObject = {
      model: mat4.create(),
      view: mat4.create(),
      proj: mat4.create(),
    };

    mat4.fromZRotation(ubo.model, -(now * 90 * Math.PI) / 180);

    const eye = vec3.fromValues(2, 2, 2);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 0, 1);
    mat4.lookAt(ubo.view, eye, center, up);

    const aspect = canvasWidth / canvasHeight;
    mat4.perspective(ubo.proj, Math.PI / 4, aspect, 0.1, 10);

    return ubo;
  }

  recordCommands(canvasWidth: number, canvasHeight: number) {
    this.#gl.clearColor(CLEAR_COLOR);

    this.#program.use();

    this.#gl.bindVertexArray(this.#vao);

    const ubo = this.#getUBO(canvasWidth, canvasHeight);

    this.#gl.uniformMatrix4fv(this.#uModelLoc, false, ubo.model);
    this.#gl.uniformMatrix4fv(this.#uViewLoc, false, ubo.view);
    this.#gl.uniformMatrix4fv(this.#uProjLoc, false, ubo.proj);

    this.#gl.drawIndexed(TEST_INDICES.length, 1);
  }
}
