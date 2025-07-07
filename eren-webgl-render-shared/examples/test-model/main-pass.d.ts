import { GL } from '../../dist/gl.js';
import { MainUBO, LightUBO } from './ubo';
import { MeshBuffer } from './mesh';
export declare class MainPass {
    #private;
    constructor(gl: GL, shadowTexture: WebGLTexture, bitmap: ImageBitmap);
    rebindShadowTexture(shadowTexture: WebGLTexture): void;
    updateMainUBO(ubo: MainUBO): void;
    updateLightUBO(ubo: LightUBO): void;
    recordCommands(meshes: MeshBuffer[]): void;
}
