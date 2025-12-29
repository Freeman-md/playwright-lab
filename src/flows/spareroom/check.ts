import { chromium } from 'playwright';

export async function checkSpareRoomSession() {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: 'spareroom-session.json',
  });

  const page = await context.newPage();

  // Go directly to an authenticated-only page
  await page.goto('https://www.spareroom.co.uk/myaccount.pl', {
    waitUntil: 'domcontentloaded',
  });

  const currentUrl = page.url();

  await browser.close();

  // If we were redirected to login, session is dead
  if (/login|signin/i.test(currentUrl)) {
    return 'SpareRoom session expired';
  }

  return 'SpareRoom session is valid';
}
