import { GL } from '../../dist/gl.js';
import { Vertex } from './vertex';
export interface MeshBuffer {
    vao: WebGLVertexArrayObject;
    indexCount: number;
}
export declare function createMeshBuffer(gl: GL, vertices: Vertex[], indices: number[]): MeshBuffer;
