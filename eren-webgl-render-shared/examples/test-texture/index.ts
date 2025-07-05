import { GL } from '../../dist/gl.js';
import { TestRenderer } from './renderer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const res = await fetch('./assets/logo.jpg');
const blob = await res.blob();                 // <- 브라우저 디코더 사용
const bitmap = await createImageBitmap(blob);  // RGBA8 기본 포맷

const gl = new GL(canvas.getContext('webgl2') as WebGL2RenderingContext);
const renderer = new TestRenderer(gl, bitmap);

function frame() {
  renderer.render(canvas.width, canvas.height);
  requestAnimationFrame(frame);
}

frame();
