import { GL } from '../../dist/gl.js';
import { MainUBO, LightUBO } from './ubo';
import { MeshBuffer } from './mesh';
export declare class MainPass {
    #private;
    constructor(gl: GL, shadowTexture: WebGLTexture);
    /** ShadowMap이 다시 만들어졌을 때 재결합 */
    rebindShadowTexture(shadowTexture: WebGLTexture): void;
    updateMainUBO(ubo: MainUBO): void;
    updateLightUBO(ubo: LightUBO): void;
    recordCommands(meshes: MeshBuffer[]): void;
}
