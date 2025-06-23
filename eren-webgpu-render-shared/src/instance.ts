export class Instance {
  #gpu: GPU;

  preferredFormat: GPUTextureFormat;

  constructor() {
    if (!navigator.gpu) throw new Error('WebGPU support is not available');
    this.#gpu = navigator.gpu;
    this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  }

  async requestAdapter() {
    const adapter = await this.#gpu.requestAdapter({
      powerPreference: 'high-performance',
      forceFallbackAdapter: false,
    });
    if (!adapter) throw new Error('Failed to request Adapter.');
    return adapter;
  }
}
