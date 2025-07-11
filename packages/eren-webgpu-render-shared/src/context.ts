export class Context {
  #context: GPUCanvasContext;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('webgpu');
    if (!context) throw new Error('Failed to get WebGPU context');
    this.#context = context;
  }

  configure(configuration: GPUCanvasConfiguration) {
    this.#context.configure(configuration);
  }

  getCurrentTexture(): GPUTexture {
    return this.#context.getCurrentTexture();
  }
}
