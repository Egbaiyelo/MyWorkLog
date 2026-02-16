import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
};

export const test = base.extend<ExtensionFixtures>({
  context: async ({ }, 
    use: (context: BrowserContext) => Promise<void>) => {
      
    const pathToExtension = path.join(__dirname, '../extension');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      // headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }: { context: BrowserContext }, use: (extensionId: string) => Promise<void>) => {
    // for manifest v3:
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent('serviceworker');

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
export type { BrowserContext };