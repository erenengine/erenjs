import { mat4 } from 'gl-matrix';

export interface UniformBufferObject {
  model: mat4;
  view: mat4;
  proj: mat4;
}

export function flattenUBO(ubo: UniformBufferObject): Float32Array {
  const buffer = new Float32Array(16 * 3);

  buffer.set(ubo.model, 0);
  buffer.set(ubo.view, 16);
  buffer.set(ubo.proj, 32);

  return buffer;
}
