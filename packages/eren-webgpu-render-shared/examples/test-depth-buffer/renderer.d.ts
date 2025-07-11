import { Device } from '../../dist/device.js';
export declare class TestRenderer {
    #private;
    constructor(device: Device, format: GPUTextureFormat, canvasWidth: number, canvasHeight: number);
    resize(canvasWidth: number, canvasHeight: number): void;
    render(view: GPUTextureView, canvasWidth: number, canvasHeight: number): void;
}
