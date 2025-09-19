import { Device } from '../../lib/device.js';
import { flattenVertices, Vertex } from './vertex';

export interface MeshBuffer {
  buffer: GPUBuffer;
  vertexOffset: number;
  indexOffset: number;
  indexCount: number;
}

export function createMeshBuffer(device: Device, vertices: Vertex[], indices: number[]): MeshBuffer {
  const flatVertexData = flattenVertices(vertices);
  const vertexFloatLength = flatVertexData.length;
  const vertexSize = vertexFloatLength * 4;
  const indexCount = indices.length;
  const indexSize = indexCount * 2;

  const indexOffset = (vertexSize + 3) & ~3; // 4-byte alignment
  const totalSize = indexOffset + indexSize;

  const buffer = device.createBuffer({
    label: 'Test Buffer',
    size: totalSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  const mapping = new Uint8Array(buffer.getMappedRange());
  new Float32Array(mapping.buffer).set(flatVertexData);
  new Uint16Array(mapping.buffer, indexOffset, indexCount).set(indices);
  buffer.unmap();

  return {
    buffer,
    vertexOffset: 0,
    indexOffset,
    indexCount,
  };
}
