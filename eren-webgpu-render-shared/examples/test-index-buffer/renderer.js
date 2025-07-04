import { TestRenderPass } from './render-pass';
export class TestRenderer {
    #device;
    #renderPass;
    constructor(device, format) {
        this.#device = device;
        this.#renderPass = new TestRenderPass(device, format);
    }
    render(view) {
        const encoder = this.#device.createCommandEncoder({ label: 'Test Render Encoder' });
        this.#renderPass.recordCommands(encoder, view);
        this.#device.queue.submit([encoder.finish()]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9DLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLE9BQU8sQ0FBUztJQUNoQixXQUFXLENBQWlCO0lBRTVCLFlBQVksTUFBYyxFQUFFLE1BQXdCO1FBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBb0I7UUFDekIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSAnLi4vLi4vZGlzdC9kZXZpY2UuanMnO1xuaW1wb3J0IHsgVGVzdFJlbmRlclBhc3MgfSBmcm9tICcuL3JlbmRlci1wYXNzJztcblxuZXhwb3J0IGNsYXNzIFRlc3RSZW5kZXJlciB7XG4gICNkZXZpY2U6IERldmljZTtcbiAgI3JlbmRlclBhc3M6IFRlc3RSZW5kZXJQYXNzO1xuXG4gIGNvbnN0cnVjdG9yKGRldmljZTogRGV2aWNlLCBmb3JtYXQ6IEdQVVRleHR1cmVGb3JtYXQpIHtcbiAgICB0aGlzLiNkZXZpY2UgPSBkZXZpY2U7XG4gICAgdGhpcy4jcmVuZGVyUGFzcyA9IG5ldyBUZXN0UmVuZGVyUGFzcyhkZXZpY2UsIGZvcm1hdCk7XG4gIH1cblxuICByZW5kZXIodmlldzogR1BVVGV4dHVyZVZpZXcpIHtcbiAgICBjb25zdCBlbmNvZGVyID0gdGhpcy4jZGV2aWNlLmNyZWF0ZUNvbW1hbmRFbmNvZGVyKHsgbGFiZWw6ICdUZXN0IFJlbmRlciBFbmNvZGVyJyB9KTtcbiAgICB0aGlzLiNyZW5kZXJQYXNzLnJlY29yZENvbW1hbmRzKGVuY29kZXIsIHZpZXcpO1xuICAgIHRoaXMuI2RldmljZS5xdWV1ZS5zdWJtaXQoW2VuY29kZXIuZmluaXNoKCldKTtcbiAgfVxufVxuIl19