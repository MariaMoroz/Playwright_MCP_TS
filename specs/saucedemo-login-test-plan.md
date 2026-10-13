# Saucedemo Login Feature Test Plan

## Application Overview

Test plan for the Saucedemo login flow (https://www.saucedemo.com), covering acceptance criteria AC1-AC10 from user-stories/saucedemo_login_feature.md. Scope: Chrome/chromium only, viewport 1280x720 (do not resize). All scenarios assume a fresh browser context (no cookies, empty session storage) and start from https://www.saucedemo.com/. Password for all users: secret_sauce. Users: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user.

Notes:
- Story typo: AC1 says `standart_user`; the correct username is `standard_user` (used in all scenarios). `standart_user` is not an accepted user and would show the AC5 error.
- Rule: if a browser action does not respond within 60 seconds, mark the step BLOCKED and continue with the next test case.
- Locators observed (exploration): username `[data-test="username"]` (#user-name, placeholder "Username"); password `[data-test="password"]` (#password, placeholder "Password", type=password); button `[data-test="login-button"]` (value "Login"); error `[data-test="error"]`; dismiss `[data-test="error-button"]` (aria-label "Dismiss error"); inventory title `[data-test="title"]`.
- Observed behaviour (exploration): with both fields empty, the message is "Username is required" (username is validated first). Error state adds class `error` to both inputs and shows 2 red `svg.error_icon` elements; clicking X removes the message and icons. Page title is "Swag Labs". performance_glitch_user login took ~5.1 s; other users ~0.1 s. Direct access to /inventory.html or /cart.html when logged out shows the login page with: "Epic sadface: You can only access '/inventory.html' when you are logged in." Back after login returns to the login page (session persists; Forward returns to inventory); back after logout shows the login page with the access error. problem_user and visual_user show a broken placeholder image (sl-404) for the first product; error_user sort triggers alert "Sorting is broken! This error has been reported to Backtrace."
- Validation is exact-match: username/password are case sensitive and whitespace is not trimmed.
- Seed file: tests/seed.spec.ts. Each test is independent; logging out is done via burger menu (#react-burger-menu-btn) then "Logout" (#logout_sidebar_link).

## Test Scenarios

### 1. 1. Successful Login (AC1, AC7-AC10)

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-01 Login with standard_user redirects to Products page [AC1]

**File:** `tests/login/tc-01-standard-user-login.spec.ts`

**Steps:**
  1. Test data: username=standard_user, password=secret_sauce. Navigate to https://www.saucedemo.com/.
    - expect: Login page is displayed with Username, Password fields and Login button
    - expect: No error message is visible
  2. Type standard_user in the Username field.
    - expect: Field shows standard_user
  3. Type secret_sauce in the Password field.
    - expect: Field shows masked characters (type=password)
  4. Click the Login button.
    - expect: URL becomes https://www.saucedemo.com/inventory.html
    - expect: Page header text 'Products' is displayed
    - expect: 6 inventory items are listed
    - expect: No error message is shown

#### 1.2. TC-02 Login with problem_user shows Products page with known UI bugs [AC7]

**File:** `tests/login/tc-02-problem-user-login.spec.ts`

**Steps:**
  1. Test data: username=problem_user, password=secret_sauce. Navigate to https://www.saucedemo.com/ and enter the credentials.
    - expect: Credentials are entered; password is masked
  2. Click Login.
    - expect: URL is /inventory.html
    - expect: Heading 'Products' is displayed
  3. Inspect product images.
    - expect: Known bug: product images are wrong/placeholder (e.g. sl-404 image instead of the real product image) - record as expected defect behaviour, not a failure
  4. Optionally change sort option or open checkout (known broken sort/checkout fields).
    - expect: Sort does not reorder correctly or checkout fields misbehave - login test itself passes regardless

#### 1.3. TC-03 Login with error_user shows Products page; sort triggers error [AC8]

**File:** `tests/login/tc-03-error-user-login.spec.ts`

**Steps:**
  1. Test data: username=error_user, password=secret_sauce. Navigate to https://www.saucedemo.com/ and enter the credentials.
    - expect: Credentials are entered
  2. Click Login.
    - expect: URL is /inventory.html
    - expect: Heading 'Products' is displayed
  3. Select 'Name (Z to A)' in the product sort dropdown (register a dialog handler first).
    - expect: Alert 'Sorting is broken! This error has been reported to Backtrace.' appears; accept it
    - expect: Product order is not changed (known behaviour for error_user)

#### 1.4. TC-04 Login with performance_glitch_user succeeds after ~5 second delay [AC9]

**File:** `tests/login/tc-04-performance-glitch-user-login.spec.ts`

**Steps:**
  1. Test data: username=performance_glitch_user, password=secret_sauce. Navigate to https://www.saucedemo.com/ and enter the credentials.
    - expect: Credentials are entered
  2. Record start time and click Login.
    - expect: Login does not complete instantly; page stays on login page for a few seconds
  3. Wait for URL /inventory.html (timeout 15 s) and record elapsed time.
    - expect: Redirect to /inventory.html occurs after approximately 5 seconds (accept 4.5 s - 8 s; observed ~5.1 s)
    - expect: Heading 'Products' is displayed
    - expect: 6 inventory items are listed
  4. Compare with standard_user login time (TC-01).
    - expect: standard_user logs in in well under 1 second, so the delay is specific to performance_glitch_user

#### 1.5. TC-05 Login with visual_user shows Products page with visual discrepancies [AC10]

**File:** `tests/login/tc-05-visual-user-login.spec.ts`

**Steps:**
  1. Test data: username=visual_user, password=secret_sauce. Navigate to https://www.saucedemo.com/ and enter the credentials.
    - expect: Credentials are entered
  2. Click Login.
    - expect: URL is /inventory.html
    - expect: Heading 'Products' is displayed
  3. Compare the inventory page layout/images against standard_user (visual snapshot or manual inspection).
    - expect: Visual/layout discrepancies are present (e.g. wrong product image, misaligned elements) - expected behaviour for this user

### 2. 2. Negative Login Scenarios (AC2-AC5)

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-06 Locked out user sees lockout error [AC2]

**File:** `tests/login/tc-06-locked-out-user.spec.ts`

**Steps:**
  1. Test data: username=locked_out_user, password=secret_sauce. Navigate to https://www.saucedemo.com/, enter credentials and click Login.
    - expect: URL remains https://www.saucedemo.com/
    - expect: Error shown exactly: 'Epic sadface: Sorry, this user has been locked out.'
    - expect: User is not logged in (no Products page)

#### 2.2. TC-07 Empty username shows 'Username is required' [AC3]

**File:** `tests/login/tc-07-empty-username.spec.ts`

**Steps:**
  1. Test data: username=(empty), password=secret_sauce. Navigate to https://www.saucedemo.com/, leave Username empty, type secret_sauce in Password, click Login.
    - expect: URL remains /
    - expect: Error shown exactly: 'Epic sadface: Username is required'
    - expect: Both inputs show error styling

#### 2.3. TC-08 Empty password shows 'Password is required' [AC4]

**File:** `tests/login/tc-08-empty-password.spec.ts`

**Steps:**
  1. Test data: username=standard_user, password=(empty). Navigate to https://www.saucedemo.com/, type standard_user in Username, leave Password empty, click Login.
    - expect: URL remains /
    - expect: Error shown exactly: 'Epic sadface: Password is required'

#### 2.4. TC-09 Both fields empty shows 'Username is required' [AC3]

**File:** `tests/login/tc-09-both-empty.spec.ts`

**Steps:**
  1. Test data: username=(empty), password=(empty). Navigate to https://www.saucedemo.com/ and click Login without entering anything.
    - expect: URL remains /
    - expect: Error shown exactly: 'Epic sadface: Username is required' (username is validated first; 'Password is required' is not shown)

#### 2.5. TC-10 Invalid username and invalid password show mismatch error [AC5]

**File:** `tests/login/tc-10-invalid-credentials.spec.ts`

**Steps:**
  1. Test data: username=invalid_user, password=wrong_pass. Navigate to https://www.saucedemo.com/, enter credentials, click Login.
    - expect: URL remains /
    - expect: Error shown exactly: 'Epic sadface: Username and password do not match any user in this service'

#### 2.6. TC-11 Valid username with wrong password shows mismatch error [AC5]

**File:** `tests/login/tc-11-wrong-password.spec.ts`

**Steps:**
  1. Test data: username=standard_user, password=wrong. Enter credentials and click Login.
    - expect: Error shown exactly: 'Epic sadface: Username and password do not match any user in this service'
    - expect: User stays on login page

#### 2.7. TC-12 Typo username standart_user is rejected (story typo check) [AC1, AC5]

**File:** `tests/login/tc-12-standart-user-typo.spec.ts`

**Steps:**
  1. Test data: username=standart_user (typo from AC1 text), password=secret_sauce. Enter credentials and click Login.
    - expect: Error shown exactly: 'Epic sadface: Username and password do not match any user in this service'
    - expect: Confirms AC1 must use standard_user; the story text should be corrected

#### 2.8. TC-13 Failed login followed by correct login succeeds [AC1, AC5]

**File:** `tests/login/tc-13-retry-after-failure.spec.ts`

**Steps:**
  1. Test data: first invalid_user/wrong_pass, then standard_user/secret_sauce. Submit invalid credentials.
    - expect: Mismatch error is displayed
  2. Without reloading, clear fields, enter standard_user / secret_sauce and click Login.
    - expect: Redirect to /inventory.html
    - expect: Heading 'Products' is displayed

#### 2.9. TC-14 Different consecutive errors replace the previous message [AC3, AC4, AC5]

**File:** `tests/login/tc-14-error-message-replaced.spec.ts`

**Steps:**
  1. Test data: sequence of empty/empty, standard_user/empty, invalid_user/wrong_pass. Click Login with empty fields.
    - expect: 'Username is required' displayed
  2. Type standard_user, leave password empty, click Login.
    - expect: Only 'Epic sadface: Password is required' is displayed (single error container)
  3. Enter invalid_user / wrong_pass and click Login.
    - expect: Only the mismatch error is displayed; no stacked or duplicate messages

### 3. 3. Error Dismissal and UI Validation (AC6)

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-15 Error message can be dismissed with the X button [AC6]

**File:** `tests/login/tc-15-dismiss-error.spec.ts`

**Steps:**
  1. Test data: username=(empty), password=(empty). Click Login on fresh login page.
    - expect: Error message and X button ([data-test=error-button], aria-label 'Dismiss error') are visible
  2. Click the X button.
    - expect: Error message disappears
    - expect: Red error icons disappear
    - expect: Login form remains usable on the same page
  3. Enter standard_user / secret_sauce and click Login.
    - expect: Login succeeds and /inventory.html is displayed

#### 3.2. TC-16 Red error icons are shown on both fields when login fails [AC6]

**File:** `tests/login/tc-16-red-error-icons.spec.ts`

**Steps:**
  1. Test data: invalid_user / wrong_pass. Verify no error icons before submitting.
    - expect: 0 error icons (svg.error_icon) are present on the fresh page
  2. Submit invalid credentials.
    - expect: Red error icon displayed inside Username field
    - expect: Red error icon displayed inside Password field (2 icons total)
    - expect: Both inputs have error styling (class 'error', red underline/border)
  3. Dismiss the error via X.
    - expect: Error icons are removed from both fields

#### 3.3. TC-17 Login page UI elements, placeholders and password masking [AC6]

**File:** `tests/login/tc-17-login-ui-elements.spec.ts`

**Steps:**
  1. Test data: none. Navigate to https://www.saucedemo.com/ at 1280x720.
    - expect: Page title is 'Swag Labs'; 'Swag Labs' logo text visible
  2. Inspect the Username field.
    - expect: Placeholder is 'Username'
    - expect: Field is empty and enabled
  3. Inspect the Password field.
    - expect: Placeholder is 'Password'
    - expect: Input type is password (characters masked when typing)
  4. Inspect the Login button.
    - expect: Button is visible, enabled, labelled 'Login'
  5. Inspect the credentials info panel.
    - expect: 'Accepted usernames are:' lists the six users; 'Password for all users:' shows secret_sauce

#### 3.4. TC-18 Submitting the form with the Enter key logs in [AC1]

**File:** `tests/login/tc-18-enter-key-submit.spec.ts`

**Steps:**
  1. Test data: standard_user / secret_sauce. Enter credentials, focus the Password field.
    - expect: Credentials entered
  2. Press Enter.
    - expect: Redirect to /inventory.html with 'Products' heading

### 4. 4. Edge Cases (AC3-AC5)

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-19 Username is case sensitive [AC5]

**File:** `tests/login/tc-19-username-case-sensitive.spec.ts`

**Steps:**
  1. Test data: username=STANDARD_USER, password=secret_sauce. Enter credentials and click Login.
    - expect: Login rejected; error 'Epic sadface: Username and password do not match any user in this service'
    - expect: URL remains /
  2. Repeat with username=Standard_User.
    - expect: Same mismatch error

#### 4.2. TC-20 Password is case sensitive [AC5]

**File:** `tests/login/tc-20-password-case-sensitive.spec.ts`

**Steps:**
  1. Test data: username=standard_user, password=SECRET_SAUCE. Enter credentials and click Login.
    - expect: Login rejected with mismatch error 'Epic sadface: Username and password do not match any user in this service'

#### 4.3. TC-21 Leading/trailing whitespace in credentials is not trimmed [AC5]

**File:** `tests/login/tc-21-whitespace-credentials.spec.ts`

**Steps:**
  1. Test data: username='standard_user ' (trailing space), password=secret_sauce. Login.
    - expect: Mismatch error is shown; user not logged in
  2. Test data: username=' standard_user' (leading space), password=secret_sauce. Login.
    - expect: Mismatch error is shown
  3. Test data: username=standard_user, password='secret_sauce ' (trailing space). Login.
    - expect: Mismatch error is shown

#### 4.4. TC-22 Whitespace-only username is treated as invalid, not empty [AC5]

**File:** `tests/login/tc-22-whitespace-only-username.spec.ts`

**Steps:**
  1. Test data: username='   ' (3 spaces), password=secret_sauce. Login.
    - expect: Error is 'Epic sadface: Username and password do not match any user in this service' (not 'Username is required'), as observed
    - expect: User not logged in

#### 4.5. TC-23 Very long username and password (1000 characters) are handled gracefully [AC5]

**File:** `tests/login/tc-23-long-input.spec.ts`

**Steps:**
  1. Test data: username='a' x 1000, password='b' x 1000. Enter credentials and click Login.
    - expect: Page does not crash or hang; layout is not broken
    - expect: Mismatch error is displayed
    - expect: URL remains /

#### 4.6. TC-24 Special characters and script/SQL injection strings are rejected safely [AC5]

**File:** `tests/login/tc-24-special-characters.spec.ts`

**Steps:**
  1. Test data: username=<script>alert(1)</script>, password=' OR '1'='1. Enter credentials and click Login.
    - expect: No alert dialog appears (no script execution)
    - expect: Mismatch error is displayed; input is not rendered as HTML
    - expect: User not logged in
  2. Test data: username=!@#$%^&*()_+, password=~`{}|[]. Login.
    - expect: Mismatch error displayed; no crash

### 5. 5. Navigation Flow and Session Access

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-25 Direct access to /inventory.html without login is blocked [AC1]

**File:** `tests/login/tc-25-direct-inventory-access.spec.ts`

**Steps:**
  1. Test data: none (fresh session). Navigate directly to https://www.saucedemo.com/inventory.html.
    - expect: Login page is displayed; Products page is not shown
    - expect: Error shown: "Epic sadface: You can only access '/inventory.html' when you are logged in."
  2. Navigate directly to https://www.saucedemo.com/cart.html.
    - expect: Login page with error "Epic sadface: You can only access '/cart.html' when you are logged in."

#### 5.2. TC-26 Browser Back button after login returns to login page and session persists [AC1]

**File:** `tests/login/tc-26-back-after-login.spec.ts`

**Steps:**
  1. Test data: standard_user / secret_sauce. Log in successfully.
    - expect: On /inventory.html with 'Products' heading
  2. Click the browser Back button.
    - expect: Login page at / is displayed without an error message (observed behaviour); Products page not shown
  3. Click the browser Forward button.
    - expect: /inventory.html is displayed again with 'Products' (session persists)
  4. Reload the page.
    - expect: Still on /inventory.html and logged in

#### 5.3. TC-27 Browser Back button after logout does not expose the Products page [AC1]

**File:** `tests/login/tc-27-back-after-logout.spec.ts`

**Steps:**
  1. Test data: standard_user / secret_sauce. Log in successfully.
    - expect: On /inventory.html
  2. Open burger menu and click Logout.
    - expect: Redirect to login page /
    - expect: Username and Password fields are empty
  3. Click the browser Back button.
    - expect: Products page is NOT accessible; login page is displayed with error "Epic sadface: You can only access '/inventory.html' when you are logged in." (URL may be / or /inventory.html)
    - expect: No inventory items visible
  4. Try to interact: attempt to reload the page.
    - expect: Still redirected to/kept on login page; user remains logged out

#### 5.4. TC-28 Direct access to /inventory.html after logout is blocked [AC1]

**File:** `tests/login/tc-28-inventory-after-logout.spec.ts`

**Steps:**
  1. Test data: standard_user / secret_sauce. Log in and then log out via burger menu > Logout.
    - expect: Login page displayed
  2. Navigate directly to https://www.saucedemo.com/inventory.html.
    - expect: Login page is shown with the 'You can only access /inventory.html when you are logged in' error; Products page is not shown

#### 5.5. TC-29 Logged-in user can log in again after logout with different user [AC1, AC2, AC7]

**File:** `tests/login/tc-29-relogin-different-user.spec.ts`

**Steps:**
  1. Test data: standard_user then problem_user, password secret_sauce. Log in as standard_user and log out.
    - expect: Login page with cleared fields
  2. Log in as problem_user.
    - expect: Redirect to /inventory.html with 'Products' heading
    - expect: No residual data from the previous user
