struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragUV: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 3>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0,  3.0),
        vec2<f32>( 3.0, -1.0)
    );

    var uvs = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 2.0),
        vec2<f32>(2.0, 0.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.fragUV = uvs[vertexIndex];
    return output;
}

@group(0) @binding(0)
var shadowMap: texture_depth_2d;

@group(0) @binding(1)
var shadowSampler: sampler_comparison;

@fragment
fn fs_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    // 예를 들어 기준 깊이값을 0.5로 설정
    let depth: f32 = textureSampleCompare(shadowMap, shadowSampler, fragUV, 0.5);
    return vec4<f32>(vec3<f32>(depth), 1.0);
}
