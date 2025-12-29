import { Browser, chromium, Page } from "playwright";

export async function createPage(): Promise<{
    browser: Browser,
    page: Page
}> {
    const browser = await chromium.launch()
    const page = await browser.newPage();

    return {
        browser,
        page
    }
}

export async function closeBrowser(browser: Browser) {
    await browser.close()
}