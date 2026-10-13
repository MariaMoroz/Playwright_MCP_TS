# Exploratory Testing Results - Saucedemo Login

- **Date:** 2026-10-12
- **Application:** https://www.saucedemo.com
- **Browser:** Chromium (Playwright MCP), fixed 1280x720 viewport, not resized
- **Plan:** [specs/saucedemo-login-test-plan.md](../specs/saucedemo-login-test-plan.md)
- **Method:** Playwright MCP browser tools, each scenario executed against a clean session (cookies, session/local storage cleared)

## Summary

| Result | Count |
|--------|-------|
| PASS | 29 |
| FAIL | 0 |
| BLOCKED | 0 |

Every scenario matched the plan's expected results. The known application defects for `problem_user`, `error_user` and `visual_user` were observed and are recorded as expected behaviour (AC7, AC8, AC10), not as failures.

## Execution Results

| ID | Title | AC | Result | Actual result | Evidence |
|----|-------|----|--------|---------------|----------|
| TC-01 | standard_user login | AC1 | PASS | `/inventory.html`, "Products", 6 items, no error, ~80 ms | [png](screenshots/TC-01-standard-user-inventory.png) |
| TC-02 | problem_user login | AC7 | PASS | `/inventory.html`, "Products". All 6 product images are `sl-404` placeholders (known bug) | [png](screenshots/TC-02-problem-user-inventory.png) |
| TC-03 | error_user login + sort | AC8 | PASS | `/inventory.html`, "Products". Sort Z-A shows alert "Sorting is broken! This error has been reported to Backtrace." and order is unchanged | [png](screenshots/TC-03-error-user-sort.png) |
| TC-04 | performance_glitch_user delay | AC9 | PASS | Login took 5115 ms and 5108 ms (standard_user ~80 ms), then "Products" with 6 items | [png](screenshots/TC-04-performance-glitch-inventory.png) |
| TC-05 | visual_user login | AC10 | PASS | `/inventory.html`, "Products". First product image is the `sl-404` placeholder, the other five are real images | [png](screenshots/TC-05-visual-user-inventory.png) |
| TC-06 | locked_out_user | AC2 | PASS | Stays on `/`; "Epic sadface: Sorry, this user has been locked out." | [png](screenshots/TC-06-locked-out-user.png) |
| TC-07 | Empty username | AC3 | PASS | "Epic sadface: Username is required"; 2 error icons; inputs have class `error` | [png](screenshots/TC-07-empty-username.png) |
| TC-08 | Empty password | AC4 | PASS | "Epic sadface: Password is required" | [png](screenshots/TC-08-empty-password.png) |
| TC-09 | Both fields empty | AC3 | PASS | "Epic sadface: Username is required" (username validated first) | [png](screenshots/TC-09-both-empty.png) |
| TC-10 | Invalid user and password | AC5 | PASS | "Epic sadface: Username and password do not match any user in this service" | [png](screenshots/TC-10-invalid-credentials.png) |
| TC-11 | Valid user, wrong password | AC5 | PASS | Same mismatch error, stays on `/` | - |
| TC-12 | `standart_user` typo | AC1, AC5 | PASS | Mismatch error; confirms the story typo | - |
| TC-13 | Retry after failure | AC1, AC5 | PASS | Mismatch error, then login without reload reaches `/inventory.html` | - |
| TC-14 | Error message replaced | AC3-AC5 | PASS | Messages are replaced each time; always exactly 1 error container | - |
| TC-15 | Dismiss error with X | AC6 | PASS | X (`aria-label="Dismiss error"`) removes the error and both icons; form still usable and login works | [before](screenshots/TC-15-error-before-dismiss.png), [after](screenshots/TC-15-error-after-dismiss.png) |
| TC-16 | Red error icons | AC6 | PASS | 0 icons on a fresh page, 2 `svg.error_icon` after failure, both inputs have class `error`; icons removed on dismiss | [png](screenshots/TC-16-red-error-icons.png) |
| TC-17 | Login page UI | AC6 | PASS | Title "Swag Labs"; placeholders "Username" / "Password"; password input `type=password`; "Login" button enabled; credentials panel lists 6 users and `secret_sauce` | [png](screenshots/TC-17-login-page-ui.png) |
| TC-18 | Submit with Enter | AC1 | PASS | Enter in the password field logs in to `/inventory.html` | - |
| TC-19 | Username case sensitive | AC5 | PASS | `STANDARD_USER` and `Standard_User` both rejected with the mismatch error | [png](screenshots/TC-19-username-case.png) |
| TC-20 | Password case sensitive | AC5 | PASS | `SECRET_SAUCE` rejected with the mismatch error | - |
| TC-21 | Whitespace not trimmed | AC5 | PASS | Trailing or leading space in username, or trailing space in password, rejected | - |
| TC-22 | Whitespace-only username | AC5 | PASS | Mismatch error, not "Username is required" | - |
| TC-23 | 1000-character input | AC5 | PASS | Mismatch error; no layout break (scrollWidth 1280); page responsive | [png](screenshots/TC-23-long-input.png) |
| TC-24 | Special characters / injection | AC5 | PASS | Mismatch error; no alert fired; no `<script>` rendered in the error | [png](screenshots/TC-24-special-chars.png) |
| TC-25 | Direct `/inventory.html` without login | AC1 | PASS | Login page with "Epic sadface: You can only access '/inventory.html' when you are logged in."; `/cart.html` gives the equivalent message; URL is `/` | [png](screenshots/TC-25-direct-inventory-access.png) |
| TC-26 | Back after login | AC1 | PASS | Back goes to login page `/` with no error (verified in a clean browser context); Forward returns to `/inventory.html`; reload keeps the session | [png](screenshots/TC-26-back-after-login.png) |
| TC-27 | Back after logout | AC1 | PASS | Logout clears both fields. Back shows the login page with the access error and 0 inventory items (URL `/inventory.html`); reload gives URL `/` with 0 items | [png](screenshots/TC-27-back-after-logout.png) |
| TC-28 | Direct access after logout | AC1 | PASS | Access error shown, 0 inventory items | [png](screenshots/TC-28-inventory-after-logout.png) |
| TC-29 | Re-login with a different user | AC1, AC7 | PASS | Fields cleared after logout; `problem_user` reaches `/inventory.html`; empty cart badge | [png](screenshots/TC-29-relogin-different-user.png) |

## Findings and Observations

1. **Story typo (documentation issue):** AC1 says `standart_user`, which is not a valid user. The valid user is `standard_user`; `standart_user` is rejected (TC-12).
2. **Validation order:** with both fields empty, only "Username is required" is shown (TC-09).
3. **performance_glitch_user:** the URL changes to `/inventory.html` immediately after the click, but the "Products" heading renders only after about 5.1 s (5115 ms and 5108 ms measured, vs ~80 ms for standard_user). A first measurement that only waited for the URL showed ~1 s for this reason. Automated tests must wait for the heading, with a timeout of at least 10 s, not for the URL.
4. **Back after logout:** the login page shows the access error in all runs. The URL is `/inventory.html` right after Back and `/` after reload, so the plan's "either URL" assertion is appropriate.
5. **Back after login in a reused session:** after a `/cart.html` access error earlier in the same tab history, Back showed that stale error on the login page. In a clean context no error appears (TC-26). Tests should use isolated contexts.
6. **Known application defects (expected per user story):**
   - `problem_user`: all product images are `sl-404` placeholders.
   - `visual_user`: the first product image is the `sl-404` placeholder.
   - `error_user`: sort triggers the "Sorting is broken!" alert and does not reorder products.
7. **Not executed (optional steps in the plan):** sort and checkout behaviour for `problem_user` (TC-02 step 4), and the visual comparison of `visual_user` against `standard_user` beyond the image check (TC-05 step 3).
8. **Console:** the browser console repeatedly logged `401 Unauthorized` errors for the third-party Backtrace telemetry endpoint (`events.backtrace.io`). No functional impact observed; not a login defect.
9. **Dialog handling (tooling note):** the MCP browser intercepts native alerts and hides script results. Capturing the alert by overriding `window.alert` in the page worked.

## Reliable Selectors

| Element | Selector |
|---------|----------|
| Username input | `[data-test="username"]` (`#user-name`) |
| Password input | `[data-test="password"]` (`#password`) |
| Login button | `[data-test="login-button"]` |
| Error message | `[data-test="error"]` |
| Error dismiss (X) | `[data-test="error-button"]` (`aria-label="Dismiss error"`) |
| Error icons | `svg.error_icon` (2 on failure) |
| Input error state | class `error` on both inputs |
| Page title | `[data-test="title"]` ("Products") |
| Inventory items | `[data-test="inventory-item"]` (6) |
| Item names / images | `[data-test="inventory-item-name"]`, `.inventory_item_img img` |
| Sort dropdown | `[data-test="product-sort-container"]` (value `za` = Z to A) |
| Burger menu | `#react-burger-menu-btn` |
| Logout link | `[data-test="logout-sidebar-link"]` |
| Credentials panel | `[data-test="login-credentials"]`, `[data-test="login-password"]` |
| Cart badge | `[data-test="shopping-cart-badge"]` |

## Wait Strategies and Quirks

- Use `expect(page).toHaveURL(/inventory\.html/)` with a longer timeout (for example 15 s) for `performance_glitch_user`; other users log in in under 1 s.
- Register a `page.on('dialog')` handler before triggering the `error_user` sort.
- Use a fresh browser context per test; session state persists in the tab history.
- Do not rely on the URL after Back following logout; assert the login page, the access error and zero inventory items.
