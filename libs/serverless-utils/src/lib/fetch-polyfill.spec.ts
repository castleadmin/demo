describe('fetch-polyfill', () => {
  it('Should apply fetch polyfill successfully', async () => {
    jest.resetModules();
    const globalFetch = global.fetch;
    global.fetch = undefined as unknown as typeof global.fetch;
    const globalHeaders = global.Headers;
    globalThis.Headers = undefined as unknown as typeof globalThis.Headers;
    const globalRequest = global.Request;
    globalThis.Request = undefined as unknown as typeof globalThis.Request;
    const globalResponse = global.Response;
    globalThis.Response = undefined as unknown as typeof globalThis.Response;

    await import('./fetch-polyfill');

    expect(global.fetch).toBeTruthy();
    expect(global.Headers).toBeTruthy();
    expect(global.Request).toBeTruthy();
    expect(global.Response).toBeTruthy();

    global.fetch = globalFetch;
    globalThis.Headers = globalHeaders;
    globalThis.Request = globalRequest;
    globalThis.Response = globalResponse;
  });
});
