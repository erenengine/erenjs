import { Device } from '../../dist/device.js';
import { MeshBuffer } from './mesh';
export declare class TestRenderer {
    #private;
    constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number, bitmap: ImageBitmap);
    resize(canvasWidth: number, canvasHeight: number): void;
    render(view: GPUTextureView, meshes: MeshBuffer[], canvasWidth: number, canvasHeight: number): void;
}
