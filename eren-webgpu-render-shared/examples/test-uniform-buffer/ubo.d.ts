import { mat4 } from 'gl-matrix';
export interface UniformBufferObject {
    model: mat4;
    view: mat4;
    proj: mat4;
}
export declare function flattenUBO(ubo: UniformBufferObject): Float32Array;
