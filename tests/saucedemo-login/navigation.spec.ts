import { test, expect } from './fixtures';
import { BASE_URL, ERRORS, INVENTORY_URL, PASSWORD, USERS } from './test-data';

test.describe('Navigation Flow and Session Access', () => {
  test.beforeEach(async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-25 Direct access to /inventory.html without login is blocked [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Navigate directly to /inventory.html
    await page.goto(INVENTORY_URL);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.items).toHaveCount(0);
    await expect(loginPage.error).toHaveText(ERRORS.accessInventory);

    // 2. Navigate directly to /cart.html
    await page.goto(`${BASE_URL}cart.html`);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.items).toHaveCount(0);
    await expect(loginPage.error).toHaveText(ERRORS.accessCart);
  });

  test('TC-26 Browser Back button after login returns to login page and session persists [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Log in
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');

    // 2. Back
    await page.goBack();
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveCount(0);

    // 3. Forward
    await page.goForward();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');

    // 4. Reload
    await page.reload();
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC-27 Browser Back button after logout does not expose the Products page [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Log in
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);

    // 2. Logout via burger menu
    await inventoryPage.logout();
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();

    // 3. Back: URL may be / or /inventory.html, so it is not asserted
    await page.goBack();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveText(ERRORS.accessInventory);
    await expect(inventoryPage.items).toHaveCount(0);

    // 4. Reload keeps the user logged out
    await page.reload();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.items).toHaveCount(0);
  });

  test('TC-28 Direct access to /inventory.html after logout is blocked [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Log in, then log out
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Navigate directly to /inventory.html
    await page.goto(INVENTORY_URL);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveText(ERRORS.accessInventory);
    await expect(inventoryPage.items).toHaveCount(0);
  });

  test('TC-29 Logged-in user can log in again after logout with different user [AC1, AC2, AC7]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Log in as standard_user and log out
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await inventoryPage.logout();
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();

    // 2. Log in as problem_user
    await loginPage.login(USERS.problem, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
