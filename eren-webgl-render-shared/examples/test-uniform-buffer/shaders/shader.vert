#version 300 es
precision mediump float;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = uProj * uView * uModel * vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}
