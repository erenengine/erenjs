import { GL } from '../../dist/gl.js';
import { MeshBuffer } from './mesh';
export declare class TestRenderer {
    #private;
    constructor(gl: GL, canvasWidth: number, canvasHeight: number, bitmap: ImageBitmap);
    resize(canvasWidth: number, canvasHeight: number): void;
    render(meshes: MeshBuffer[], canvasWidth: number, canvasHeight: number): void;
}
