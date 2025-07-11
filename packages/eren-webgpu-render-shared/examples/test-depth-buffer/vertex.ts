import { vec3 } from 'gl-matrix';

export interface Vertex {
  pos: vec3;
  color: vec3;
}

const FLOATS_PER_VERTEX = 6; // vec3 + vec3

export const VERTEX_DESC: GPUVertexBufferLayout = {
  arrayStride: 6 * 4, // 한 개 정점의 바이트 수 (stride): 3 floats + 3 floats = 6 * 4 bytes = 24 bytes
  stepMode: 'vertex',
  attributes: [
    {
      shaderLocation: 0, // position
      offset: 0,
      format: 'float32x3',
    },
    {
      shaderLocation: 1, // color
      offset: 3 * 4, // vec3 = 12 bytes
      format: 'float32x3',
    },
  ],
};

export function flattenVertices(vertices: Vertex[]): Float32Array {
  const buf = new Float32Array(vertices.length * FLOATS_PER_VERTEX);

  for (let i = 0; i < vertices.length; i++) {
    const base = i * FLOATS_PER_VERTEX;
    buf.set(vertices[i].pos, base + 0); // vec3
    buf.set(vertices[i].color, base + 3); // vec3
  }
  return buf;
}
