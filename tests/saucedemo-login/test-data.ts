export const BASE_URL = 'https://www.saucedemo.com/';
export const INVENTORY_URL = `${BASE_URL}inventory.html`;

export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export const ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  mismatch: 'Epic sadface: Username and password do not match any user in this service',
  accessInventory: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  accessCart: "Epic sadface: You can only access '/cart.html' when you are logged in.",
} as const;

export const SORT_BROKEN_ALERT = 'Sorting is broken! This error has been reported to Backtrace.';
export const BROKEN_IMAGE_MARKER = 'sl-404';
export const PRODUCT_COUNT = 6;
