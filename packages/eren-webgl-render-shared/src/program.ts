import { GL } from './gl.js';

export class Program {
  #gl: GL;
  #program: WebGLProgram;

  constructor(gl: GL, vertexShaderSource: string, fragmentShaderSource?: string) {
    this.#gl = gl;
    this.#program = this.#gl.createProgram(vertexShaderSource, fragmentShaderSource);
  }

  use() {
    this.#gl.useProgram(this.#program);
  }

  getUniformLocation(name: string) {
    const location = this.#gl.getUniformLocation(this.#program, name);
    if (!location) throw new Error(`Failed to get uniform location (${name})`);
    return location;
  }
}
