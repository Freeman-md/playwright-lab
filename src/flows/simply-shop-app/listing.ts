import { Page } from "playwright"

type ListingResult = {
  success: boolean;
  message: string;
};

const LISTING_TITLE = "New Listing"
const LISTING_DESCRIPTION = "New Listing Description"
const LISTING_PRICE = 200

export async function createListing(page: Page): Promise<ListingResult> {
  try {
    console.log("[LISTING] Waiting for dashboard");
    await page.waitForURL(/\/dashboard$/);

    console.log("[LISTING] Navigating to create item page");
    await navigateToCreateItemPage(page);

    console.log("[LISTING] Creating item");
    await createItem(page);

    console.log("[LISTING] Verifying item was created");
    await verifyListingWasCreated(page);

    console.log("[LISTING] Listing flow completed");

    return {
      success: true,
      message: "Listing created successfully",
    };
  } catch (error: any) {
    console.error("[LISTING] Listing flow failed:", error?.message);

    return {
      success: false,
      message: error?.message || "Failed to create listing",
    };
  }
}

async function navigateToCreateItemPage(page: Page) {
    const createItemButton = page.getByRole('link', { name: /create item/i });

    console.log("[LISTING] Clicking 'Create Item'");
    await createItemButton.click();
}

async function createItem(page: Page) {
    const titleInput = page.locator('#title');
    const descriptionInput = page.locator('#description');
    const priceInput = page.locator('#price');
    const submitButton = page.locator('button[type="submit"]');

    console.log("[LISTING] Filling form fields");
    await titleInput.fill(LISTING_TITLE);
    await descriptionInput.fill(LISTING_DESCRIPTION);
    await priceInput.fill(String(LISTING_PRICE));

    console.log("[LISTING] Submitting listing");
    await submitButton.click();

    console.log("[LISTING] Waiting for submission to complete");
    await page.waitForFunction(() => {
        const btn = document.querySelector('button[type="submit"]');
        return btn && !btn.hasAttribute("disabled");
    });
}

async function verifyListingWasCreated(page: Page) {
    console.log("[LISTING] Waiting for success signal or redirect");

    await Promise.race([
        page.getByRole("status").waitFor({ state: "visible" }).catch(() => {}),
        page.waitForURL(/\/items\/[a-f0-9-]+$/),
    ]);

    console.log("[LISTING] Verifying listing content");

    await page.getByText(LISTING_TITLE, { exact: false }).waitFor();
    await page.getByText(LISTING_DESCRIPTION, { exact: false }).waitFor();
    await page.getByText(String(LISTING_PRICE), { exact: false }).waitFor();

    console.log("[LISTING] Listing verified successfully");
}