import { createPage, closeBrowser } from "../../core/browser";
import { authenticate } from "../simply-shop-app/authenticate";
import { createListing } from "../simply-shop-app/listing";

export async function runSimplyShopWorkflow() {
  const { browser, page } = await createPage({
    headless: false,
    slowMo: 500,
  });

  try {
    const authResult = await authenticate(page);

    if (!authResult.success) {
      return authResult;
    }

    const listingResult = await createListing(page);
    return listingResult;
  } finally {
    await closeBrowser(browser);
  }
}