import { GL } from '../../dist/gl.js';
import { TestRenderer } from './renderer.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const gl = new GL(canvas.getContext('webgl2') as WebGL2RenderingContext);
const renderer = new TestRenderer(gl);

function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

frame();
