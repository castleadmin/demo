describe('web-socket-polyfill', () => {
  it('Should apply web socket polyfill successfully', async () => {
    jest.resetModules();
    const globalWebSocket = global.WebSocket;
    global.WebSocket = undefined as unknown as typeof global.WebSocket;

    await import('./web-socket-polyfill');

    expect(global.WebSocket).toBeTruthy();

    global.WebSocket = globalWebSocket;
  });
});
