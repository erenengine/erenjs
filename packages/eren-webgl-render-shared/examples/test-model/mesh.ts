import { FLOAT, GL } from '../../lib/gl.js';
import { flattenVertices, Vertex } from './vertex';

export interface MeshBuffer {
  vao: WebGLVertexArrayObject;
  indexCount: number;
}

export function createMeshBuffer(gl: GL, vertices: Vertex[], indices: number[]): MeshBuffer {
  const vao = gl.createVertexArray(flattenVertices(vertices), new Uint16Array(indices));

  // Enable attributes
  const stride = 8 * 4;
  gl.enableVertexAttribArray(0);             // position
  gl.vertexAttribPointer(0, 3, FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);             // color
  gl.vertexAttribPointer(1, 3, FLOAT, false, stride, 3 * 4);
  gl.enableVertexAttribArray(2);             // texCoord
  gl.vertexAttribPointer(2, 2, FLOAT, false, stride, 6 * 4);

  return {
    vao,
    indexCount: indices.length,
  };
}
