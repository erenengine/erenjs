import { Instance } from '../../dist/instance.js';
import { Adapter } from '../../dist/adapter.js';
import { Context } from '../../dist/context.js';
import { Device } from '../../dist/device.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const instance = new Instance();
const adapter = await Adapter.create(instance);
const context = new Context(canvas);
const device = await Device.create(adapter, context, instance.preferredFormat);

console.log(device);
