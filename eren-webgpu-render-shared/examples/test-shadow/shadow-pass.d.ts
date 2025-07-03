import { Device } from '../../dist/device.js';
import { MeshBuffer } from './mesh';
import { ShadowUBO } from './ubo';
export declare class ShadowPass {
    #private;
    shadowTextureView: GPUTextureView;
    constructor(device: Device, canvasWidth: number, canvasHeight: number);
    resizeShadowTexture(width: number, height: number): void;
    updateShadowUBO(shadowUBO: ShadowUBO): void;
    recordCommands(encoder: GPUCommandEncoder, meshes: MeshBuffer[]): void;
}
