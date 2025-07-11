import { GL } from '../../dist/gl.js';
export declare class DebugQuadPass {
    #private;
    constructor(gl: GL, shadowTexture: WebGLTexture);
    rebindShadowTexture(shadowTexture: WebGLTexture): void;
    recordCommands(): void;
}
