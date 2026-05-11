import { test, expect, type BrowserContext } from './fixtures';

test('myWorkLog button is injected', async ({ context }: { context: BrowserContext }) => {
    const page = await context.newPage();
    await page.goto('https://td.wd3.myworkdayjobs.com/en-US/TD_Bank_Careers');

    const button = page.locator('#myWorkLog-button-div');
    await expect(button).toBeVisible();
});