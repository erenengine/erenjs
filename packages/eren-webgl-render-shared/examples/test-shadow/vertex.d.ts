import { vec3 } from 'gl-matrix';
export interface Vertex {
    position: vec3;
    normal: vec3;
}
export declare function flattenVertices(vertices: Vertex[]): Float32Array;
