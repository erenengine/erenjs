import { Instance } from "../../dist/instance.js";
import { Adapter } from "../../dist/adapter.js";
import { Device } from "../../dist/device.js";

const instance = new Instance();
const adapter = await Adapter.create(instance);
const device = await Device.create(adapter);

console.log(device);
