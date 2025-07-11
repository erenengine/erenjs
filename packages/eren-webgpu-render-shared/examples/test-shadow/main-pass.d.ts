import { Device } from '../../dist/device.js';
import { MeshBuffer } from './mesh';
import { MainUBO, LightUBO } from './ubo';
export declare class MainPass {
    #private;
    constructor(device: Device, surfaceFormat: GPUTextureFormat, shadowTextureView: GPUTextureView, canvasWidth: number, canvasHeight: number);
    updateMainUBO(ubo: MainUBO): void;
    updateLightUBO(ubo: LightUBO): void;
    resizeDepthTexture(width: number, height: number, shadowTextureView: GPUTextureView): void;
    recordCommands(encoder: GPUCommandEncoder, surfaceView: GPUTextureView, meshes: MeshBuffer[]): void;
}
