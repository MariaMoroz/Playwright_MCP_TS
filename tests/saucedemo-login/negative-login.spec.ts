import { test, expect } from './fixtures';
import { BASE_URL, ERRORS, INVENTORY_URL, PASSWORD, USERS } from './test-data';

test.describe('Negative Login Scenarios (AC2-AC5)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-06 Locked out user sees lockout error [AC2]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials and click Login
    await loginPage.login(USERS.lockedOut, PASSWORD);
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.error).toHaveText(ERRORS.lockedOut);
    await expect(inventoryPage.title).toHaveCount(0);
  });

  test("TC-07 Empty username shows 'Username is required' [AC3]", async ({ page, loginPage }) => {
    // 1. Leave Username empty, type password, click Login
    await loginPage.login('', PASSWORD);
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.error).toHaveText(ERRORS.usernameRequired);
    await expect(loginPage.usernameInput).toHaveClass(/error/);
    await expect(loginPage.passwordInput).toHaveClass(/error/);
  });

  test("TC-08 Empty password shows 'Password is required' [AC4]", async ({ page, loginPage }) => {
    // 1. Type username, leave Password empty, click Login
    await loginPage.login(USERS.standard, '');
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.error).toHaveText(ERRORS.passwordRequired);
  });

  test("TC-09 Both fields empty shows 'Username is required' [AC3]", async ({ page, loginPage }) => {
    // 1. Click Login without entering anything
    await loginPage.submit();
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.error).toHaveText(ERRORS.usernameRequired);
    await expect(loginPage.error).not.toContainText('Password is required');
  });

  test('TC-10 Invalid username and invalid password show mismatch error [AC5]', async ({ page, loginPage }) => {
    // 1. Enter invalid credentials and click Login
    await loginPage.login('invalid_user', 'wrong_pass');
    await expect(page).toHaveURL(BASE_URL);
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
  });

  test('TC-11 Valid username with wrong password shows mismatch error [AC5]', async ({ page, loginPage }) => {
    // 1. Enter credentials and click Login
    await loginPage.login(USERS.standard, 'wrong');
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-12 Typo username standart_user is rejected (story typo check) [AC1, AC5]', async ({ loginPage }) => {
    // 1. Enter the typo username from AC1 and click Login
    await loginPage.login('standart_user', PASSWORD);
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
  });

  test('TC-13 Failed login followed by correct login succeeds [AC1, AC5]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Submit invalid credentials
    await loginPage.login('invalid_user', 'wrong_pass');
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);

    // 2. Without reloading, enter valid credentials (fill replaces existing values)
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC-14 Different consecutive errors replace the previous message [AC3, AC4, AC5]', async ({ loginPage }) => {
    // 1. Click Login with empty fields
    await loginPage.submit();
    await expect(loginPage.error).toHaveCount(1);
    await expect(loginPage.error).toHaveText(ERRORS.usernameRequired);

    // 2. Type standard_user, leave password empty, click Login
    await loginPage.login(USERS.standard, '');
    await expect(loginPage.error).toHaveCount(1);
    await expect(loginPage.error).toHaveText(ERRORS.passwordRequired);

    // 3. Enter invalid_user / wrong_pass and click Login
    await loginPage.login('invalid_user', 'wrong_pass');
    await expect(loginPage.error).toHaveCount(1);
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
  });
});
