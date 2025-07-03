#version 300 es

in vec3 inPosition;
in vec3 inNormal;

uniform mat4 uLightViewProj;

void main() {
    gl_Position = uLightViewProj * vec4(inPosition, 1.0);
}
