import { test, expect } from './fixtures';
import {
  BROKEN_IMAGE_MARKER,
  INVENTORY_URL,
  PASSWORD,
  PRODUCT_COUNT,
  SORT_BROKEN_ALERT,
  USERS,
} from './test-data';

test.describe('Successful Login (AC1, AC7-AC10)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-01 Login with standard_user redirects to Products page [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Navigate to the login page
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveCount(0);

    // 2. Type standard_user in the Username field
    await loginPage.usernameInput.fill(USERS.standard);
    await expect(loginPage.usernameInput).toHaveValue(USERS.standard);

    // 3. Type secret_sauce in the Password field
    await loginPage.passwordInput.fill(PASSWORD);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // 4. Click the Login button
    await loginPage.submit();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(PRODUCT_COUNT);
    await expect(loginPage.error).toHaveCount(0);
  });

  test('TC-02 Login with problem_user shows Products page with known UI bugs [AC7]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials
    await loginPage.fillCredentials(USERS.problem, PASSWORD);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // 2. Click Login
    await loginPage.submit();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');

    // 3. Known bug: every product image is the sl-404 placeholder
    await expect(inventoryPage.itemImages).toHaveCount(PRODUCT_COUNT);
    for (const image of await inventoryPage.itemImages.all()) {
      await expect(image).toHaveAttribute('src', new RegExp(BROKEN_IMAGE_MARKER));
    }
  });

  test('TC-03 Login with error_user shows Products page; sort triggers error [AC8]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials
    await loginPage.fillCredentials(USERS.error, PASSWORD);

    // 2. Click Login
    await loginPage.submit();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.itemNames).toHaveCount(PRODUCT_COUNT);
    const namesBefore = await inventoryPage.itemNames.allTextContents();

    // 3. Register the dialog handler before triggering the sort
    const dialogMessage = new Promise<string>((resolve) => {
      page.once('dialog', async (dialog) => {
        resolve(dialog.message());
        await dialog.accept();
      });
    });
    await inventoryPage.sortDropdown.selectOption('za');
    expect(await dialogMessage).toBe(SORT_BROKEN_ALERT);
    await expect(inventoryPage.itemNames).toHaveText(namesBefore);
  });

  test('TC-04 Login with performance_glitch_user succeeds after ~5 second delay [AC9]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials
    await loginPage.fillCredentials(USERS.performanceGlitch, PASSWORD);

    // 2. Record start time and click Login; the URL changes at once but the Products heading renders late
    const start = Date.now();
    await loginPage.submit();

    // 3. Wait for the Products page (observed ~5.1 s; accept 4.5 s - 8 s)
    await expect(inventoryPage.title).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(INVENTORY_URL);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(4500);
    expect(elapsed).toBeLessThanOrEqual(8000);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(PRODUCT_COUNT);
  });

  test('TC-04 standard_user login is much faster than performance_glitch_user [AC9]', async ({ page, loginPage, inventoryPage }) => {
    // 4. Compare with standard_user login time
    const start = Date.now();
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(inventoryPage.title).toBeVisible();
    await expect(page).toHaveURL(INVENTORY_URL);
    expect(Date.now() - start).toBeLessThan(2000);
  });

  test('TC-05 Login with visual_user shows Products page with visual discrepancies [AC10]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials
    await loginPage.fillCredentials(USERS.visual, PASSWORD);

    // 2. Click Login
    await loginPage.submit();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');

    // 3. Known bug: only the first product image is the sl-404 placeholder
    await expect(inventoryPage.itemImages).toHaveCount(PRODUCT_COUNT);
    const images = await inventoryPage.itemImages.all();
    await expect(images[0]).toHaveAttribute('src', new RegExp(BROKEN_IMAGE_MARKER));
    for (const image of images.slice(1)) {
      await expect(image).not.toHaveAttribute('src', new RegExp(BROKEN_IMAGE_MARKER));
    }
  });
});
