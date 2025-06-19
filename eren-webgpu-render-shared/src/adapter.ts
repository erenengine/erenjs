import { Instance } from './instance.js';

export class Adapter {
  #adapter: GPUAdapter;

  private constructor(adapter: GPUAdapter) {
    this.#adapter = adapter;
  }

  static async create(instance: Instance): Promise<Adapter> {
    const adapter = await instance.requestAdapter();
    return new Adapter(adapter);
  }

  requestDevice() {
    return this.#adapter.requestDevice();
  }
}
