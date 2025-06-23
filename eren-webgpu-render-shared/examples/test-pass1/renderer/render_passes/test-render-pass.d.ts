import { Device } from '../../../../dist/device.js';
export declare class TestRenderPass {
    #private;
    constructor(device: Device, format: GPUTextureFormat);
    recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView): void;
}
