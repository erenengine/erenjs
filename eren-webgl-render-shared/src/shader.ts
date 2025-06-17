type ShaderType = WebGL2RenderingContext['VERTEX_SHADER'] | WebGL2RenderingContext['FRAGMENT_SHADER'];

export function createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Failed to create shader');
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader); // 리소스 정리
    throw new Error('Failed to compile shader: ' + infoLog);
  }
  return shader;
}
