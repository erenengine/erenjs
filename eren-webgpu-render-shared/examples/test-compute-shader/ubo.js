export function flattenUBO(ubo) {
    const buffer = new Float32Array(4); // 4 x f32 = 16 bytes
    buffer[0] = ubo.time;
    buffer[1] = ubo.aspect_ratio;
    buffer[2] = ubo._padding[0];
    buffer[3] = ubo._padding[1];
    return buffer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWJvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidWJvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE1BQU0sVUFBVSxVQUFVLENBQUMsR0FBd0I7SUFDakQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFFekQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7SUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgVW5pZm9ybUJ1ZmZlck9iamVjdCB7XG4gIHRpbWU6IG51bWJlcjtcbiAgYXNwZWN0X3JhdGlvOiBudW1iZXI7XG4gIF9wYWRkaW5nOiBbbnVtYmVyLCBudW1iZXJdOyAvLyB2ZWMyPGYzMj4gcGFkZGluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlblVCTyh1Ym86IFVuaWZvcm1CdWZmZXJPYmplY3QpOiBGbG9hdDMyQXJyYXkge1xuICBjb25zdCBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KDQpOyAvLyA0IHggZjMyID0gMTYgYnl0ZXNcblxuICBidWZmZXJbMF0gPSB1Ym8udGltZTtcbiAgYnVmZmVyWzFdID0gdWJvLmFzcGVjdF9yYXRpbztcbiAgYnVmZmVyWzJdID0gdWJvLl9wYWRkaW5nWzBdO1xuICBidWZmZXJbM10gPSB1Ym8uX3BhZGRpbmdbMV07XG5cbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cbiJdfQ==