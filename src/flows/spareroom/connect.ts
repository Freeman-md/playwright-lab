import { chromium } from 'playwright';

export async function connectSpareRoom() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.spareroom.co.uk/');

  const acceptCookies = page.getByRole('button', { name: /accept all/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  await page.getByRole('link', { name: /log in/i }).click();

  console.log('Please log in manually...');

  // Better than URL: wait for logged-in-only UI
  await page.waitForURL(/myaccount|account|dashboard/i, {
    timeout: 5 * 60 * 1000, // 5 minutes
  });

  await context.storageState({ path: 'spareroom-session.json' });

  console.log('SpareRoom connected.');
  await browser.close();
}
