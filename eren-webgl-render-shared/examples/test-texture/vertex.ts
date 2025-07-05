import { vec2, vec3 } from 'gl-matrix';

export interface Vertex {
  pos: vec3;
  color: vec3;
  tex_coords: vec2;
}

const FLOATS_PER_VERTEX = 8; // vec3 + vec3 + vec2

export function flattenVertices(vertices: Vertex[]): Float32Array {
  const buf = new Float32Array(vertices.length * FLOATS_PER_VERTEX);

  for (let i = 0; i < vertices.length; i++) {
    const base = i * FLOATS_PER_VERTEX;
    buf.set(vertices[i].pos, base + 0); // vec3
    buf.set(vertices[i].color, base + 3); // vec3
    buf.set(vertices[i].tex_coords, base + 6); // vec2
  }
  return buf;
}
