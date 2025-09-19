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
const renderer = new TestRenderer(device, instance.preferredFormat);

function frame() {
  //console.log('frame');
  renderer.render(context.getCurrentTexture().createView());
  requestAnimationFrame(frame);
}

frame();
