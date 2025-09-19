import { Instance } from '../../lib/instance.js';
import { Adapter } from '../../lib/adapter.js';
import { Context } from '../../lib/context.js';
import { Device } from '../../lib/device.js';
import { TestRenderer } from './renderer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const instance = new Instance();
const adapter = await Adapter.create(instance);
const context = new Context(canvas);
const device = await Device.create(adapter, context, instance.preferredFormat);

const res = await fetch('./assets/logo.jpg');
const blob = await res.blob();                 // <- 브라우저 디코더 사용
const bitmap = await createImageBitmap(blob);  // RGBA8 기본 포맷

const renderer = new TestRenderer(device, instance.preferredFormat, canvas.width, canvas.height, bitmap);

function frame() {
  renderer.render(context.getCurrentTexture().createView(), canvas.width, canvas.height);
  requestAnimationFrame(frame);
}

frame();
