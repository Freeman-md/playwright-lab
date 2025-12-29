import { closeBrowser, createPage } from "../core/browser";

export async function runDay1DropdownSelect() {
    const { browser, page } = await createPage()

    await page.goto('https://the-internet.herokuapp.com/dropdown');

    const dropdown = page.locator('#dropdown')

    await dropdown.selectOption({ label: 'Option 2' })

    const selectedValue = await dropdown.inputValue()

    await closeBrowser(browser)
    return selectedValue
}