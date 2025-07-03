
type ShaderType = WebGL2RenderingContext['VERTEX_SHADER'] | WebGL2RenderingContext['FRAGMENT_SHADER'];

export const ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER;
export const ELEMENT_ARRAY_BUFFER = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
export const STATIC_DRAW = WebGL2RenderingContext.STATIC_DRAW;
export const FLOAT = WebGL2RenderingContext.FLOAT;
export const LESS = WebGL2RenderingContext.LESS;

const EMPTY_FRAGMENT_SHADER = `#version 300 es
precision mediump float;
void main() { }`;

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

  createProgram(vertexShaderSource: string, fragmentShaderSource?: string) {
    const vertexShader = this.#createShader(vertexShaderSource, this.#gl.VERTEX_SHADER);
    const fragmentShader = this.#createShader(fragmentShaderSource ?? EMPTY_FRAGMENT_SHADER, this.#gl.FRAGMENT_SHADER);

    const program = this.#gl.createProgram();
    this.#gl.attachShader(program, vertexShader);
    if (fragmentShader) this.#gl.attachShader(program, fragmentShader);
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

  createVertexArray(data: ArrayBufferView, indices?: ArrayBufferView) {
    const vao = this.#gl.createVertexArray();
    this.#gl.bindVertexArray(vao);

    const vbo = this.#gl.createBuffer();
    this.#gl.bindBuffer(ARRAY_BUFFER, vbo);
    this.#gl.bufferData(ARRAY_BUFFER, data, STATIC_DRAW);

    if (indices) {
      const ebo = this.#gl.createBuffer();
      this.#gl.bindBuffer(ELEMENT_ARRAY_BUFFER, ebo);
      this.#gl.bufferData(ELEMENT_ARRAY_BUFFER, indices, STATIC_DRAW);
    }
    return vao;
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

  uniform3fv(location: WebGLUniformLocation, value: Float32List) {
    this.#gl.uniform3fv(location, value);
  }

  getUniformLocation(program: WebGLProgram, name: string) {
    return this.#gl.getUniformLocation(program, name);
  }

  clearColor(clearColor: { r: number; g: number; b: number; a: number; }) {
    this.#gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
  }

  draw(vertexCount: number, instanceCount: number) {
    this.#gl.drawArraysInstanced(this.#gl.TRIANGLES, 0, vertexCount, instanceCount);
  }

  drawElements(indexCount: number) {
    this.#gl.drawElements(this.#gl.TRIANGLES, indexCount, this.#gl.UNSIGNED_SHORT, 0);
  }

  drawIndexed(indexCount: number, instanceCount: number) {
    this.#gl.drawElementsInstanced(this.#gl.TRIANGLE_STRIP, indexCount, this.#gl.UNSIGNED_SHORT, 0, instanceCount);
  }

  enableDepthTest() {
    this.#gl.enable(this.#gl.DEPTH_TEST);
  }

  disableDepthTest() {
    this.#gl.disable(this.#gl.DEPTH_TEST);
  }

  depthFunc(func: number) {
    this.#gl.depthFunc(func);
  }

  clearDepth(depth: number) {
    this.#gl.clearDepth(depth);
    this.#gl.clear(this.#gl.DEPTH_BUFFER_BIT);
  }

  createDepthTexture(width: number, height: number) {
    const gl = this.#gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error('Failed to create depth texture');

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      width,
      height,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      null,
    );

    // Depth comparison mode so it can be sampled as a sampler2DShadow later.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LESS);

    // Nearest sampling & clamp‑to‑edge to avoid artefacts.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  createDepthFramebuffer(depthTexture: WebGLTexture) {
    const gl = this.#gl;
    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error('Failed to create shadow framebuffer');

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      depthTexture,
      0,
    );

    // No colour attachments → disable colour writes.
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Incomplete shadow framebuffer: 0x${status.toString(16)}`);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fbo;
  }

  bindDepthFramebuffer(framebuffer: WebGLFramebuffer) {
    this.#gl.bindFramebuffer(this.#gl.FRAMEBUFFER, framebuffer);
    this.#gl.colorMask(false, false, false, false);
  }

  restoreFramebufferDefaultState() {
    this.#gl.bindVertexArray(null);
    this.#gl.bindFramebuffer(this.#gl.FRAMEBUFFER, null);
    this.#gl.colorMask(true, true, true, true);
  }

  deleteTexture(texture: WebGLTexture) {
    this.#gl.deleteTexture(texture);
  }

  deleteFramebuffer(framebuffer: WebGLFramebuffer) {
    this.#gl.deleteFramebuffer(framebuffer);
  }

  bindTextureToSamplerForRawDepth(texture: WebGLTexture, location: WebGLUniformLocation) {
    const gl = this.#gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const prevCompare = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE);
    if (prevCompare !== gl.NONE) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
    }
    gl.uniform1i(location, 0);
    return prevCompare;
  }

  restoreTextureState(prevCompare: number) {
    const gl = this.#gl;
    gl.bindVertexArray(null);
    if (prevCompare !== gl.NONE) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, prevCompare);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.enable(gl.DEPTH_TEST);
  }
}
