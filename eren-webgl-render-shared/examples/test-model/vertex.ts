import { vec2, vec3 } from 'gl-matrix';

export interface Vertex {
  position: vec3;
  normal: vec3;
  texCoord: vec2;
}

const FLOATS_PER_VERTEX = 8; // vec3 + vec3 + vec2

export function flattenVertices(vertices: Vertex[]): Float32Array {
  const buf = new Float32Array(vertices.length * FLOATS_PER_VERTEX);

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    const base = i * FLOATS_PER_VERTEX;
    buf.set(vertex.position, base + 0); // vec3
    buf.set(vertex.normal, base + 3); // vec3
    buf.set(vertex.texCoord, base + 6); // vec2
  }
  return buf;
}
