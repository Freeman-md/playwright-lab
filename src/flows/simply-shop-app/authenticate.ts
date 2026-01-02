import { closeBrowser, createPage } from "../../core/browser";
import { Page } from 'playwright'
import { APP_URL } from "./config/app";

const LOGIN_URL = `${APP_URL}/login`;
const USERNAME = "jamesondoe@gmail.com"
const PASSWORD = "password"

const ERROR_MAP: Record<number, string> = {
    1001: "Invalid email or password",
    1002: "User not found",
    1003: "Account locked",
};


export async function authenticate(page: Page): Promise<{
    success: boolean;
    message?: string;
}> {
    await page.goto(LOGIN_URL);
    
    console.log("[AUTH] Starting authentication flow");

    console.log("[AUTH] Waiting for Sign In page");
    await page
        .getByRole("heading", { name: /sign\s*in|log\s*in/i })
        .waitFor({ state: "visible" });

    console.log("[AUTH] Attempting login");
    let result = await login(page);

    if (!result.success && result.message === ERROR_MAP[1001]) {
        console.log("[AUTH] Login failed: user not found → switching to Sign Up");

        await page.getByTestId("toggle-mode-button").click();

        console.log("[AUTH] Waiting for Sign Up page");
        await page
            .getByRole("heading", { name: /sign\s*up|create\s*account/i })
            .waitFor({ state: "visible" });

        console.log("[AUTH] Performing signup");
        await signUp(page);

        console.log("[AUTH] Switching back to Sign In");

        await page.reload();

        await page
            .getByRole("heading", { name: /sign\s*in|log\s*in/i })
            .waitFor({ state: "visible" });

        console.log("[AUTH] Retrying login after signup");
        result = await login(page);
    }

    console.log("[AUTH] Authentication result:", result);
    return result;
}


export async function login(page: Page): Promise<{
    success: boolean,
    message?: string
}> {
    console.log("[LOGIN] Filling credentials");

    const emailInput = page.locator("input[type=email]");
    const passwordInput = page.locator("input[type=password]");
    const signInButton = page.getByRole("button", { name: /Sign In/i });
    const errorBox = page.getByRole("alert");

    await emailInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);

    console.log("[LOGIN] Submitting login form");
    await signInButton.click();

    console.log("[LOGIN] Waiting for request to finish");

    await Promise.race([
        page.getByRole("alert").waitFor({ state: "visible" }).catch(() => { }),
        page.getByRole("heading", { name: /sign\s*in|log\s*in/i }).waitFor({ state: "hidden" }).catch(() => { }),
    ]);

    if (await errorBox.isVisible().catch(() => false)) {
        const message = (await errorBox.textContent())?.trim() ?? "";
        console.log("[LOGIN] Login failed:", message);
        return { success: false, message };
    }

    console.log("[LOGIN] Login successful");
    return { success: true };
}


export async function signUp(page: Page): Promise<void> {
    console.log("[SIGNUP] Filling signup form");

    const emailInput = page.locator("input[type=email]");
    const passwordInput = page.locator("input[type=password]");
    const signUpButton = page.getByRole("button", { name: /Sign Up/i });

    await emailInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);

    console.log("[SIGNUP] Submitting signup form");
    await signUpButton.click();

    console.log("[SIGNUP] Waiting for signup request to finish");
    await page.waitForFunction(() => {
        const btn = document.querySelector('button[type="submit"]');
        return btn && !btn.hasAttribute("disabled");
    });

    console.log("[SIGNUP] Signup attempt completed");
}