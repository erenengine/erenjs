#version 300 es
precision mediump float;      // WebGL2 에서는 명시적 정밀도 필요

out vec3 vColor;              // fragment 로 넘길 색상

// 내부 상수 배열
const vec2 positions[3] = vec2[3](
    vec2( 0.0, -0.5),
    vec2( 0.5,  0.5),
    vec2(-0.5,  0.5)
);

const vec3 colors[3] = vec3[3](
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0)
);

void main() {
    // WebGL2 에서는 gl_VertexID 사용
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
    vColor      = colors[gl_VertexID];
}
