import { Device } from '../../dist/device.js';
export declare class DebugQuadPass {
    #private;
    constructor(device: Device, format: GPUTextureFormat, shadowTextureView: GPUTextureView);
    rebindShadowTexture(shadowTextureView: GPUTextureView): void;
    recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView): void;
}
