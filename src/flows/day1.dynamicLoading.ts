import { createPage, closeBrowser } from '../core/browser';

export async function runDay1DynamicLoading() {
  const { browser, page } = await createPage();

  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  const startButton = page.getByRole('button', { name: /start/i });
  const loading = page.locator('#loading');
  const result = page.locator('#finish');

  await startButton.click();
  await loading.waitFor({ state: 'hidden' });

  const text = await result.textContent();
  if (!text || !text.trim()) {
    await closeBrowser(browser);
    throw new Error('Result text not found after loading');
  }

  await closeBrowser(browser);
  return text.trim();
}