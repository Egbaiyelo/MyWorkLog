import { test, expect, type BrowserContext } from './fixtures';

test('extension loads', async ({ context }: { context: BrowserContext }) => {
    let [worker] = context.serviceWorkers();

    //- should have been handled by fixtures
    if (!worker) {
        worker = await context.waitForEvent('serviceworker');
    }
    
    expect(context.serviceWorkers().length).toBeGreaterThan(0);
    console.log('Extension worker found at:', worker.url());
});