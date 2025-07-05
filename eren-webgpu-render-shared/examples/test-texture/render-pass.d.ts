import { Device } from '../../dist/device.js';
export declare class TestRenderPass {
    #private;
    constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number, bitmap: ImageBitmap);
    resizeDepthTexture(width: number, height: number): void;
    recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView, canvasWidth: number, canvasHeight: number): void;
}
