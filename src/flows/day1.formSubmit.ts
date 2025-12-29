import { closeBrowser, createPage } from "../core/browser";

export async function runDay1FormSubmit() {
    const { browser, page } = await createPage()
    await page.goto('https://the-internet.herokuapp.com/login')

    const flashMessage = page.locator('#flash')
    const usernameInput = page.locator('input[name="username"]')
    const passwordInput = page.locator('input[name="password"]')
    const loginButton = page.locator('button[type="submit"]')

    await usernameInput.fill('tomsmith')
    await passwordInput.fill('SuperSecretPassword!')

    await loginButton.click()

    await flashMessage.waitFor({ state: 'visible' });

    const rawText = await flashMessage.textContent();
    const messageText = extractMessageFromText(rawText || '');

    await closeBrowser(browser)
    return messageText

}

function extractMessageFromText(text: string) {
    return text?.replace('×', '').trim();

}