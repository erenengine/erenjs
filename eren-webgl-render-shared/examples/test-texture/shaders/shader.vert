#version 300 es
precision mediump float;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

in vec3 aPosition;
in vec3 aColor;
in vec2 aTexCoord;

out vec3 vColor;
out vec2 vTexCoord;

void main() {
    gl_Position = uProj * uView * uModel * vec4(aPosition, 1.0);
    vColor = aColor;
    vTexCoord = aTexCoord;
}
