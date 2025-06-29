
type ShaderType = WebGL2RenderingContext['VERTEX_SHADER'] | WebGL2RenderingContext['FRAGMENT_SHADER'];

export const ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER;
export const ELEMENT_ARRAY_BUFFER = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
export const STATIC_DRAW = WebGL2RenderingContext.STATIC_DRAW;
export const FLOAT = WebGL2RenderingContext.FLOAT;

export class GL {
  #gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.#gl = gl;
  }

  #createShader(source: string, type: ShaderType) {
    const shader = this.#gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');

    this.#gl.shaderSource(shader, source);
    this.#gl.compileShader(shader);

    if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
      const infoLog = this.#gl.getShaderInfoLog(shader);
      this.#gl.deleteShader(shader); // 리소스 정리
      throw new Error('Failed to compile shader: ' + infoLog);
    }

    return shader;
  }

  createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
    const vertexShader = this.#createShader(vertexShaderSource, this.#gl.VERTEX_SHADER);
    const fragmentShader = this.#createShader(fragmentShaderSource, this.#gl.FRAGMENT_SHADER);

    const program = this.#gl.createProgram();
    this.#gl.attachShader(program, vertexShader);
    this.#gl.attachShader(program, fragmentShader);
    this.#gl.linkProgram(program);

    if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)) {
      const infoLog = this.#gl.getProgramInfoLog(program);
      this.#gl.deleteProgram(program); // 리소스 정리
      throw new Error('Failed to link program: ' + infoLog);
    }

    return program;
  }

  useProgram(program: WebGLProgram) {
    this.#gl.useProgram(program);
  }

  createVertexArray() {
    return this.#gl.createVertexArray();
  }

  bindVertexArray(vao: WebGLVertexArrayObject) {
    this.#gl.bindVertexArray(vao);
  }

  createBuffer() {
    return this.#gl.createBuffer();
  }

  bindBuffer(target: number, buffer: WebGLBuffer) {
    this.#gl.bindBuffer(target, buffer);
  }

  bufferData(target: number, data: ArrayBufferView, usage: number) {
    this.#gl.bufferData(target, data, usage);
  }

  enableVertexAttribArray(index: number) {
    this.#gl.enableVertexAttribArray(index);
  }

  vertexAttribPointer(index: number, size: number, type: number, normalized: boolean, stride: number, offset: number) {
    this.#gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  }

  uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List) {
    this.#gl.uniformMatrix4fv(location, transpose, value);
  }

  getUniformLocation(program: WebGLProgram, name: string) {
    return this.#gl.getUniformLocation(program, name);
  }

  clear(clearColor: { r: number; g: number; b: number; a: number; }) {
    this.#gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
  }

  draw(vertexCount: number, instanceCount: number) {
    this.#gl.drawArraysInstanced(this.#gl.TRIANGLES, 0, vertexCount, instanceCount);
  }

  drawIndexed(indexCount: number, instanceCount: number) {
    this.#gl.drawElementsInstanced(this.#gl.TRIANGLE_STRIP, indexCount, this.#gl.UNSIGNED_SHORT, 0, instanceCount);
  }
}
