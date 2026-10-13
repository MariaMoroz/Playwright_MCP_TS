import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemImages: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemImages = page.locator('.inventory_item_img img');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
