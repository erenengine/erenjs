#version 300 es

layout(location = 0) in vec3 inPosition;

uniform mat4 uLightViewProj;

void main() {
    gl_Position = uLightViewProj * vec4(inPosition, 1.0);
}
