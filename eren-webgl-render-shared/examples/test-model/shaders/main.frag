#version 300 es
precision highp float;

in vec3 fragPosWorld;
in vec3 normalWorld;
in vec4 shadowCoord;
in vec2 fragTexCoord;

out vec4 outColor;

uniform vec3 uLightDirection;  // 단위벡터
uniform vec3 uLightColor;      // 빛 색상

uniform sampler2D shadowMap;
uniform sampler2D uTextureSampler;

float calculateShadow(vec4 shadowCoord) {
    vec3 projCoords = shadowCoord.xyz / shadowCoord.w;

    // X, Y [-1,1] → [0,1]
    vec2 shadowTexCoord = projCoords.xy * 0.5 + 0.5;
    float currentDepth = projCoords.z * 0.5 + 0.5;

    // 범위 밖이면 그림자 없음
    if (currentDepth > 1.0 || shadowTexCoord.x < 0.0 || shadowTexCoord.x > 1.0 ||
        shadowTexCoord.y < 0.0 || shadowTexCoord.y > 1.0) {
        return 0.0;
    }

    float bias = max(0.005 * (1.0 - dot(normalize(normalWorld), normalize(-uLightDirection))), 0.0005);

    float shadow = 0.0;
    float texelSize = 1.0 / 2048.0;

    for (int x = -1; x <= 1; ++x) {
        for (int y = -1; y <= 1; ++y) {
            vec2 offset = vec2(x, y) * texelSize;
            float closestDepth = texture(shadowMap, shadowTexCoord + offset).r;
            shadow += (currentDepth - bias > closestDepth) ? 1.0 : 0.0;
        }
    }

    shadow /= 9.0;

    return shadow;
}

void main() {
    vec3 norm = normalize(normalWorld);
    vec3 lightDir = normalize(-uLightDirection);

    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * uLightColor;

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uLightColor * diff;

    float shadow = calculateShadow(shadowCoord);

    vec3 baseColor;
    if (fragPosWorld.y == -1.0) {
        baseColor = vec3(0.8, 0.8, 0.8); // 땅
    } else {
        baseColor = texture(uTextureSampler, fragTexCoord).rgb; // 큐브
    }

    vec3 lighting = ambient + (1.0 - shadow) * diffuse;

    outColor = vec4(baseColor * lighting, 1.0);
}
