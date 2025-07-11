import { GL } from '../../dist/gl.js';
export declare class TestRenderer {
    #private;
    constructor(gl: GL, bitmap: ImageBitmap);
    render(canvasWidth: number, canvasHeight: number): void;
}
