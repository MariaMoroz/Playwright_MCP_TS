import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../test-data';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;
  readonly errorButton: Locator;
  readonly errorIcons: Locator;
  readonly logo: Locator;
  readonly credentialsPanel: Locator;
  readonly passwordPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.error = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
    this.errorIcons = page.locator('svg.error_icon');
    this.logo = page.locator('.login_logo');
    this.credentialsPanel = page.locator('[data-test="login-credentials"]');
    this.passwordPanel = page.locator('[data-test="login-password"]');
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async fillCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillCredentials(username, password);
    await this.submit();
  }
}
