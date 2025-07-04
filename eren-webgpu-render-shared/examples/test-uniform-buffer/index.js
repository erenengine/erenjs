import { Instance } from '../../dist/instance.js';
import { Adapter } from '../../dist/adapter.js';
import { Context } from '../../dist/context.js';
import { Device } from '../../dist/device.js';
import { TestRenderer } from './renderer';
const canvas = document.getElementById('canvas');
const instance = new Instance();
const adapter = await Adapter.create(instance);
const context = new Context(canvas);
const device = await Device.create(adapter, context, instance.preferredFormat);
const renderer = new TestRenderer(device, instance.preferredFormat);
function frame() {
    //console.log('frame');
    renderer.render(context.getCurrentTexture().createView(), canvas.width, canvas.height);
    requestAnimationFrame(frame);
}
frame();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUUxQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztBQUV0RSxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2hDLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0UsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVwRSxTQUFTLEtBQUs7SUFDWix1QkFBdUI7SUFDdkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uLy4uL2Rpc3QvaW5zdGFuY2UuanMnO1xuaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gJy4uLy4uL2Rpc3QvYWRhcHRlci5qcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi4vLi4vZGlzdC9jb250ZXh0LmpzJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4uLy4uL2Rpc3QvZGV2aWNlLmpzJztcbmltcG9ydCB7IFRlc3RSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG5cbmNvbnN0IGluc3RhbmNlID0gbmV3IEluc3RhbmNlKCk7XG5jb25zdCBhZGFwdGVyID0gYXdhaXQgQWRhcHRlci5jcmVhdGUoaW5zdGFuY2UpO1xuY29uc3QgY29udGV4dCA9IG5ldyBDb250ZXh0KGNhbnZhcyk7XG5jb25zdCBkZXZpY2UgPSBhd2FpdCBEZXZpY2UuY3JlYXRlKGFkYXB0ZXIsIGNvbnRleHQsIGluc3RhbmNlLnByZWZlcnJlZEZvcm1hdCk7XG5jb25zdCByZW5kZXJlciA9IG5ldyBUZXN0UmVuZGVyZXIoZGV2aWNlLCBpbnN0YW5jZS5wcmVmZXJyZWRGb3JtYXQpO1xuXG5mdW5jdGlvbiBmcmFtZSgpIHtcbiAgLy9jb25zb2xlLmxvZygnZnJhbWUnKTtcbiAgcmVuZGVyZXIucmVuZGVyKGNvbnRleHQuZ2V0Q3VycmVudFRleHR1cmUoKS5jcmVhdGVWaWV3KCksIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XG59XG5cbmZyYW1lKCk7XG4iXX0=