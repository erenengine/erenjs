import { GL } from '../../dist/gl.js';
export declare class TestRenderPass {
    #private;
    constructor(gl: GL, bitmap: ImageBitmap);
    recordCommands(canvasWidth: number, canvasHeight: number): void;
}
