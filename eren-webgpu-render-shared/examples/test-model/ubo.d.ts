import { mat4, vec3 } from 'gl-matrix';
export interface ShadowUBO {
    lightViewProj: mat4;
}
export declare function flattenShadowUBO(ubo: ShadowUBO): Float32Array;
export interface MainUBO {
    model: mat4;
    view: mat4;
    proj: mat4;
    lightViewProj: mat4;
}
export declare function flattenMainUBO(ubo: MainUBO): Float32Array;
export interface LightUBO {
    direction: vec3;
    color: vec3;
}
export declare function flattenLightUBO(ubo: LightUBO): Float32Array;
