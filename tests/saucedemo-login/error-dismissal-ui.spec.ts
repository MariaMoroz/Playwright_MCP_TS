import { test, expect } from './fixtures';
import { INVENTORY_URL, PASSWORD, USERS } from './test-data';

test.describe('Error Dismissal and UI Validation (AC6)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-15 Error message can be dismissed with the X button [AC6]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Click Login on a fresh login page
    await loginPage.submit();
    await expect(loginPage.error).toBeVisible();
    await expect(loginPage.errorButton).toBeVisible();
    await expect(loginPage.errorButton).toHaveAttribute('aria-label', 'Dismiss error');

    // 2. Click the X button
    await loginPage.errorButton.click();
    await expect(loginPage.error).toHaveCount(0);
    await expect(loginPage.errorIcons).toHaveCount(0);
    await expect(loginPage.loginButton).toBeEnabled();

    // 3. Log in with valid credentials
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC-16 Red error icons are shown on both fields when login fails [AC6]', async ({ loginPage }) => {
    // 1. No error icons before submitting
    await expect(loginPage.errorIcons).toHaveCount(0);

    // 2. Submit invalid credentials
    await loginPage.login('invalid_user', 'wrong_pass');
    await expect(loginPage.error).toBeVisible();
    await expect(loginPage.errorIcons).toHaveCount(2);
    await expect(loginPage.usernameInput).toHaveClass(/error/);
    await expect(loginPage.passwordInput).toHaveClass(/error/);

    // 3. Dismiss the error via X
    await loginPage.errorButton.click();
    await expect(loginPage.errorIcons).toHaveCount(0);
  });

  test('TC-17 Login page UI elements, placeholders and password masking [AC6]', async ({ page, loginPage }) => {
    // 1. Title and logo
    await expect(page).toHaveTitle('Swag Labs');
    await expect(loginPage.logo).toHaveText('Swag Labs');

    // 2. Username field
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.usernameInput).toBeEnabled();

    // 3. Password field
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // 4. Login button
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.loginButton).toHaveValue('Login');

    // 5. Credentials info panel
    await expect(loginPage.credentialsPanel).toContainText('Accepted usernames are:');
    for (const user of Object.values(USERS)) {
      await expect(loginPage.credentialsPanel).toContainText(user);
    }
    await expect(loginPage.passwordPanel).toContainText('Password for all users:');
    await expect(loginPage.passwordPanel).toContainText(PASSWORD);
  });

  test('TC-18 Submitting the form with the Enter key logs in [AC1]', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter credentials, focus the Password field
    await loginPage.fillCredentials(USERS.standard, PASSWORD);
    await loginPage.passwordInput.focus();

    // 2. Press Enter
    await loginPage.passwordInput.press('Enter');
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
