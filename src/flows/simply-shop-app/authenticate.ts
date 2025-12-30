import { closeBrowser, createPage } from "../../core/browser";
import { Page } from 'playwright'

const LOGIN_URL = "https://simply-shop-app.lovable.app/login"
const USERNAME = "johndoe@gmail.com"
const PASSWORD = "password"

const ERROR_MAP: Record<number, string> = {
    1001: "Invalid email or password",
    1002: "User not found",
    1003: "Account locked",
};


export async function authenticate(): Promise<{
    success: boolean;
    message?: string;
}> {
    const { browser, page } = await createPage();

    await page.goto(LOGIN_URL)

    const togglePageButton = page.getByTestId("toggle-test-mode");

    await page
        .getByRole("heading", { name: /sign\s*in|log\s*in/i })
        .waitFor({ state: "visible" });

    let result = await login(page);

    if (!result.success && result.message === ERROR_MAP[1001]) {
        await togglePageButton.click();

        await page
            .getByRole("heading", { name: /sign\s*up|create\s*account/i })
            .waitFor({ state: "visible" });

        await signUp(page);

        await togglePageButton.click();

        await page
            .getByRole("heading", { name: /sign\s*in|log\s*in/i })
            .waitFor({ state: "visible" });

        result = await login(page);
    }

    await closeBrowser(browser);
    return result;
}


export async function login(page: Page): Promise<{
    success: boolean,
    message?: string
}> {
    const emailInput = page.locator("input[type=email]")
    const passwordInput = page.locator("input[type=password]")
    const signInButton = page.getByRole("button", { name: /Sign In/i })
    const errorBox = page.getByRole("alert");

    await emailInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);

    await signInButton.click()

    await page.waitForFunction(
        (button) => !button.isDisabled,
        signInButton
    )

    if (await errorBox.isVisible().catch(() => false)) {
        const message = (await errorBox.textContent())?.trim() ?? ""

        return { success: false, message };
    }

    return { success: true };
}

export async function signUp(page: Page): Promise<void> {
    const emailInput = page.locator("input[type=email]")
    const passwordInput = page.locator("input[type=password]")
    const signUpButton = page.getByRole("button", { name: /Sign Up/i })

    await emailInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);

    await signUpButton.click()

    await page.waitForFunction(
        (button) => !button.isDisabled,
        signUpButton
    )
}