import { vec2, vec3 } from 'gl-matrix';

export interface Vertex {
  pos: vec2;
  color: vec3;
}

const FLOATS_PER_VERTEX = 5; // vec2 + vec3

export function flattenVertices(vertices: Vertex[]): Float32Array {
  const buf = new Float32Array(vertices.length * FLOATS_PER_VERTEX);

  for (let i = 0; i < vertices.length; i++) {
    const base = i * FLOATS_PER_VERTEX;
    buf.set(vertices[i].pos, base + 0); // vec2
    buf.set(vertices[i].color, base + 2); // vec3
  }
  return buf;
}
