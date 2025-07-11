export interface UniformBufferObject {
  time: number;
  aspect_ratio: number;
  _padding: [number, number]; // vec2<f32> padding
}

export function flattenUBO(ubo: UniformBufferObject): Float32Array {
  const buffer = new Float32Array(4); // 4 x f32 = 16 bytes

  buffer[0] = ubo.time;
  buffer[1] = ubo.aspect_ratio;
  buffer[2] = ubo._padding[0];
  buffer[3] = ubo._padding[1];

  return buffer;
}
