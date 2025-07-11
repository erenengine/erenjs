import { mat4 } from 'gl-matrix';

export interface StorageBufferObject {
  model: mat4;
  view: mat4;
  proj: mat4;
}

export function flattenSBO(sbo: StorageBufferObject): Float32Array {
  const buffer = new Float32Array(16 * 3);

  buffer.set(sbo.model, 0);
  buffer.set(sbo.view, 16);
  buffer.set(sbo.proj, 32);

  return buffer;
}
