import { vec2, vec3 } from 'gl-matrix';
export interface Vertex {
    pos: vec3;
    color: vec3;
    tex_coords: vec2;
}
export declare function flattenVertices(vertices: Vertex[]): Float32Array;
