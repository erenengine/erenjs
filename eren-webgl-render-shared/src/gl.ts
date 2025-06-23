
type ShaderType = WebGL2RenderingContext['VERTEX_SHADER'] | WebGL2RenderingContext['FRAGMENT_SHADER'];

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

  clear(clearColor: { r: number; g: number; b: number; a: number; }) {
    this.#gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
  }

  draw(vertexCount: number, instanceCount: number) {
    this.#gl.drawArraysInstanced(this.#gl.TRIANGLES, 0, vertexCount, instanceCount);
  }
}
