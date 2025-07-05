#version 300 es

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inNormal;

out vec3 fragPosWorld;
out vec3 normalWorld;
out vec4 shadowCoord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
uniform mat4 uLightViewProj;

void main() {
    vec4 worldPos = uModel * vec4(inPosition, 1.0);

    fragPosWorld = worldPos.xyz;
    normalWorld = mat3(transpose(inverse(uModel))) * inNormal;
    shadowCoord = uLightViewProj * worldPos;

    gl_Position = uProj * uView * worldPos;
}
