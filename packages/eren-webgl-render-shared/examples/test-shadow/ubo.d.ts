import { mat4, vec3 } from 'gl-matrix';
export interface ShadowUBO {
    lightViewProj: mat4;
}
export interface MainUBO {
    model: mat4;
    view: mat4;
    proj: mat4;
    lightViewProj: mat4;
}
export interface LightUBO {
    direction: vec3;
    color: vec3;
}
