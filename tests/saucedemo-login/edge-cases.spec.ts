import { test, expect } from './fixtures';
import { BASE_URL, ERRORS, PASSWORD, USERS } from './test-data';

test.describe('Edge Cases (AC3-AC5)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-19 Username is case sensitive [AC5]', async ({ page, loginPage }) => {
    // 1-2. STANDARD_USER, then Standard_User
    for (const username of ['STANDARD_USER', 'Standard_User']) {
      await loginPage.login(username, PASSWORD);
      await expect(loginPage.error).toHaveText(ERRORS.mismatch);
      await expect(page).toHaveURL(BASE_URL);
    }
  });

  test('TC-20 Password is case sensitive [AC5]', async ({ loginPage }) => {
    // 1. Enter uppercase password and click Login
    await loginPage.login(USERS.standard, 'SECRET_SAUCE');
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
  });

  test('TC-21 Leading/trailing whitespace in credentials is not trimmed [AC5]', async ({ page, loginPage }) => {
    const cases: Array<[string, string]> = [
      ['standard_user ', PASSWORD], // 1. trailing space in username
      [' standard_user', PASSWORD], // 2. leading space in username
      ['standard_user', 'secret_sauce '], // 3. trailing space in password
    ];
    for (const [username, password] of cases) {
      await loginPage.login(username, password);
      await expect(loginPage.error).toHaveText(ERRORS.mismatch);
      await expect(page).toHaveURL(BASE_URL);
    }
  });

  test('TC-22 Whitespace-only username is treated as invalid, not empty [AC5]', async ({ page, loginPage }) => {
    // 1. Three spaces as username
    await loginPage.login('   ', PASSWORD);
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('TC-23 Very long username and password (1000 characters) are handled gracefully [AC5]', async ({ page, loginPage }) => {
    // 1. Enter 1000-character credentials and click Login
    await loginPage.login('a'.repeat(1000), 'b'.repeat(1000));
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
    await expect(page).toHaveURL(BASE_URL);

    const viewportWidth = page.viewportSize()!.width;
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('TC-24 Special characters and script/SQL injection strings are rejected safely [AC5]', async ({ page, loginPage }) => {
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    // 1. Script and SQL injection strings
    await loginPage.login('<script>alert(1)</script>', "' OR '1'='1");
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
    await expect(loginPage.error.locator('script')).toHaveCount(0);
    await expect(page).toHaveURL(BASE_URL);
    expect(dialogs).toHaveLength(0);

    // 2. Special characters
    await loginPage.login('!@#$%^&*()_+', '~`{}|[]');
    await expect(loginPage.error).toHaveText(ERRORS.mismatch);
    await expect(page).toHaveURL(BASE_URL);
    expect(dialogs).toHaveLength(0);
  });
});
