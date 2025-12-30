import { Browser, chromium, Page } from "playwright";

type CreatePageOptions = {
  headless?: boolean;
  slowMo?: number
};

export async function createPage(
  options: CreatePageOptions = {}
): Promise<{
  browser: Browser;
  page: Page;
}> {
  const browser = await chromium.launch({
    headless: options.headless ?? true,
    slowMo: options.slowMo
  });

  const page = await browser.newPage();

  return { browser, page };
}

export async function closeBrowser(browser: Browser) {
  await browser.close();
}