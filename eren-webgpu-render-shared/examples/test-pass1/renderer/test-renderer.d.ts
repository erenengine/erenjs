import { Device } from '../../../dist/device.js';
export declare class TestRenderer {
    #private;
    constructor(device: Device, format: GPUTextureFormat);
    render(view: GPUTextureView): void;
}
