import { Device } from '../../dist/device.js';
import { Vertex } from './vertex';
export interface MeshBuffer {
    buffer: GPUBuffer;
    vertexOffset: number;
    indexOffset: number;
    indexCount: number;
}
export declare function createMeshBuffer(device: Device, vertices: Vertex[], indices: number[]): MeshBuffer;
