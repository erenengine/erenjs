import { GL } from '../../dist/gl.js';
import { ShadowUBO } from './ubo';
import { MeshBuffer } from './mesh';
export declare class ShadowPass {
    #private;
    shadowTexture: WebGLTexture;
    constructor(gl: GL, canvasWidth: number, canvasHeight: number);
    resizeShadowTexture(width: number, height: number): void;
    updateShadowUBO(ubo: ShadowUBO): void;
    recordCommands(meshes: MeshBuffer[]): void;
}
