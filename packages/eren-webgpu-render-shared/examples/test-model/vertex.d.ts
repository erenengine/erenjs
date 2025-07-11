import { vec2, vec3 } from 'gl-matrix';
export interface Vertex {
    position: vec3;
    normal: vec3;
    texCoord: vec2;
}
export declare const VERTEX_DESC: GPUVertexBufferLayout;
export declare function flattenVertices(vertices: Vertex[]): Float32Array;
