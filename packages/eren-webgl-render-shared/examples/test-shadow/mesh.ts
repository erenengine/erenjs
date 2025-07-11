import { FLOAT, GL } from '../../dist/gl.js';
import { flattenVertices, Vertex } from './vertex';

export interface MeshBuffer {
  vao: WebGLVertexArrayObject;
  indexCount: number;
}

export function createMeshBuffer(gl: GL, vertices: Vertex[], indices: number[]): MeshBuffer {
  const vao = gl.createVertexArray(flattenVertices(vertices), new Uint16Array(indices));

  // Enable attributes
  const stride = 6 * 4;
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, FLOAT, false, stride, 3 * 4);

  return {
    vao,
    indexCount: indices.length,
  };
}
