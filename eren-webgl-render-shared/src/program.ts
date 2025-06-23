import { GL } from './gl.js';

export class Program {
  #gl: GL;
  #program: WebGLProgram;

  constructor(gl: GL, vertexShaderSource: string, fragmentShaderSource: string) {
    this.#gl = gl;
    this.#program = this.#gl.createProgram(vertexShaderSource, fragmentShaderSource);
  }

  use() {
    this.#gl.useProgram(this.#program);
  }
}
