import { mat4 } from 'gl-matrix';
export interface StorageBufferObject {
    model: mat4;
    view: mat4;
    proj: mat4;
}
export declare function flattenSBO(sbo: StorageBufferObject): Float32Array;
