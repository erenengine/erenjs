import { mat4, vec3 } from 'gl-matrix';

export interface ShadowUBO {
  lightViewProj: mat4;
}

export function flattenShadowUBO(ubo: ShadowUBO): Float32Array {
  const buffer = new Float32Array(16);

  buffer.set(ubo.lightViewProj, 0);

  return buffer;
}

export interface MainUBO {
  model: mat4;
  view: mat4;
  proj: mat4;
  lightViewProj: mat4;
}

export function flattenMainUBO(ubo: MainUBO): Float32Array {
  const buffer = new Float32Array(16 * 4);

  buffer.set(ubo.model, 0);
  buffer.set(ubo.view, 16);
  buffer.set(ubo.proj, 32);
  buffer.set(ubo.lightViewProj, 48);

  return buffer;
}

export interface LightUBO {
  direction: vec3;
  color: vec3;
}

export function flattenLightUBO(ubo: LightUBO): Float32Array {
  const buffer = new Float32Array(8);

  buffer.set(ubo.direction, 0);
  buffer.set(ubo.color, 4);

  return buffer;
}
