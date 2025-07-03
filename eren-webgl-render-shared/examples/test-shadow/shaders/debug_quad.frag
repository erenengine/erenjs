#version 300 es
precision highp float;

in vec2 fragUV;

out vec4 outColor;

uniform sampler2D shadowMap;

void main() {
    float depth = texture(shadowMap, fragUV).r;
    outColor = vec4(vec3(depth), 1.0); // 흑백 시각화
}
