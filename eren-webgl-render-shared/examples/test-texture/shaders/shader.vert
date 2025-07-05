#version 300 es
precision mediump float;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aColor;
layout(location = 2) in vec2 aTexCoord;

out vec3 vColor;
out vec2 vTexCoord;

void main() {
    gl_Position = uProj * uView * uModel * vec4(aPosition, 1.0);
    vColor = aColor;
    vTexCoord = aTexCoord;
}
