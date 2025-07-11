export interface UniformBufferObject {
    time: number;
    aspect_ratio: number;
    _padding: [number, number];
}
export declare function flattenUBO(ubo: UniformBufferObject): Float32Array;
