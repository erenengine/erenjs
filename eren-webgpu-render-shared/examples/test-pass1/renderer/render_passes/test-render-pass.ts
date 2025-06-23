import SHADER_STR from "../../shaders/shader.wgsl";
import { Device } from "../../../../dist/device.js";

const CLEAR_COLOR = { r: 0.1921, g: 0.302, b: 0.4745, a: 1 };

export class TestRenderPass {
  #pipeline: GPURenderPipeline;

  constructor(device: Device, format: GPUTextureFormat) {
    let shaderModule = device.createShaderModule({ label: "Test Shader", code: SHADER_STR });
    let pipelineLayout = device.createPipelineLayout({ label: "Test Pipeline Layout", bindGroupLayouts: [] }); // WebGPU에서는 pushConstantRanges를 지원하지 않음

    this.#pipeline = device.createRenderPipeline({
      label: "Test Pipeline",
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [{ format }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  recordCommands(encoder: GPUCommandEncoder, view: GPUTextureView) {
    const passEncoder = encoder.beginRenderPass({
      colorAttachments: [{
        view,
        loadOp: "clear",
        storeOp: "store",
        clearValue: CLEAR_COLOR,
      }],
    });
    passEncoder.setPipeline(this.#pipeline);
    passEncoder.draw(3, 1);
    passEncoder.end();
  }
}
