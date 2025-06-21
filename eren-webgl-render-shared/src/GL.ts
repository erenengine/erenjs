export class GL {
  #gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.#gl = gl;
  }
}
