# Saucedemo Login - Test Execution Report

- **Date:** 2026-10-12
- **Application:** https://www.saucedemo.com
- **Environment:** Windows, Chromium via Playwright (project `chromium`), viewport 1280x720
- **Story:** [user-stories/saucedemo_login_feature.md](../user-stories/saucedemo_login_feature.md)
- **Plan:** [specs/saucedemo-login-test-plan.md](../specs/saucedemo-login-test-plan.md)
- **Manual results:** [test-evidence/exploratory-testing-results.md](../test-evidence/exploratory-testing-results.md)

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Test cases planned | 29 (TC-01 to TC-29) |
| Executed manually | 29 |
| Executed automatically | 29 (30 automated tests; TC-04 has two) |
| Manual result | 29 PASS, 0 FAIL, 0 BLOCKED |
| Automation, first run | 29 PASS, 1 FAIL |
| Automation, final run | 30 PASS, 0 FAIL (stable: 90/90 with `--repeat-each=3`) |
| Application defects found | 0 functional defects; 2 low-severity documentation observations |

**Overall status: PASS.** All 10 acceptance criteria are covered manually and by automation. The known issues of `problem_user`, `error_user` and `visual_user` behave as described in the story (AC7, AC8, AC10).

## 2. Manual Test Results (Step 3)

All 29 scenarios passed. Full per-scenario results are in [exploratory-testing-results.md](../test-evidence/exploratory-testing-results.md). Screenshots are in [test-evidence/screenshots/](../test-evidence/screenshots/).

| Group | Test cases | Result |
|-------|-----------|--------|
| Successful logins (AC1, AC7-AC10) | TC-01 to TC-05 | 5 PASS |
| Negative logins (AC2-AC5) | TC-06 to TC-14 | 9 PASS |
| Error dismissal and UI (AC6, AC1) | TC-15 to TC-18 | 4 PASS |
| Edge cases (AC5) | TC-19 to TC-24 | 6 PASS |
| Navigation and session (AC1) | TC-25 to TC-29 | 5 PASS |

Key evidence:

| Topic | Screenshot |
|-------|-----------|
| standard_user inventory | [TC-01](../test-evidence/screenshots/TC-01-standard-user-inventory.png) |
| problem_user broken images | [TC-02](../test-evidence/screenshots/TC-02-problem-user-inventory.png) |
| error_user sort error | [TC-03](../test-evidence/screenshots/TC-03-error-user-sort.png) |
| performance_glitch_user | [TC-04](../test-evidence/screenshots/TC-04-performance-glitch-inventory.png) |
| visual_user | [TC-05](../test-evidence/screenshots/TC-05-visual-user-inventory.png) |
| Locked out user | [TC-06](../test-evidence/screenshots/TC-06-locked-out-user.png) |
| Empty username error | [TC-07](../test-evidence/screenshots/TC-07-empty-username.png) |
| Invalid credentials | [TC-10](../test-evidence/screenshots/TC-10-invalid-credentials.png) |
| Error before / after dismiss | [before](../test-evidence/screenshots/TC-15-error-before-dismiss.png), [after](../test-evidence/screenshots/TC-15-error-after-dismiss.png) |
| Red error icons | [TC-16](../test-evidence/screenshots/TC-16-red-error-icons.png) |
| Back after logout | [TC-27](../test-evidence/screenshots/TC-27-back-after-logout.png) |

Observations from manual testing:

- AC1 contains the typo `standart_user`; the correct user is `standard_user` (TC-12 confirms `standart_user` is rejected).
- `performance_glitch_user` is redirected to `/inventory.html` immediately; the "Products" heading appears after about 5.1 s.
- Back after logout shows the login page with the access error; the URL is `/inventory.html` or `/` depending on timing.
- The console shows 401 errors for the third-party Backtrace telemetry endpoint; no impact on login.
- Not executed: the optional sort and checkout checks for `problem_user` and the visual comparison of `visual_user` beyond the image check.

## 3. Automated Test Results

### 3.1 Generated scripts (Step 4)

Location: `tests/saucedemo-login/`. TypeScript, Page Object Model and fixtures, no fixed waits.

| File | Contents |
|------|----------|
| `test-data.ts` | Users, password, URLs and exact error messages |
| `fixtures.ts` | `loginPage` and `inventoryPage` fixtures |
| `pages/login.page.ts`, `pages/inventory.page.ts` | Page objects |
| `successful-login.spec.ts` | TC-01 to TC-05 (6 tests; TC-04 has an extra speed comparison) |
| `negative-login.spec.ts` | TC-06 to TC-14 |
| `error-dismissal-ui.spec.ts` | TC-15 to TC-18 |
| `edge-cases.spec.ts` | TC-19 to TC-24 |
| `navigation.spec.ts` | TC-25 to TC-29 |

### 3.2 Initial execution (Step 5)

Command: `npx playwright test tests/saucedemo-login --project=chromium --reporter=line`

Result: 29 passed, 1 failed (30 tests).

| Test | Failure | Cause |
|------|---------|-------|
| TC-04 Login with performance_glitch_user succeeds after ~5 second delay | `expect(page).toHaveURL(BASE_URL)` received `/inventory.html` | Test design error. The URL changes immediately; only the "Products" heading is delayed |

### 3.3 Healing activities

| Attempt | Change | Result |
|---------|--------|--------|
| 1 | Replaced the URL assertions with waiting for the "Products" heading (15 s timeout) and `toHaveCount(0)` on the heading right after the click | Failed in a full parallel run. Click auto-waits for navigation, so the heading was sometimes already present. Passed in isolation |
| 2 | Removed the intermediate "heading absent" assertion. The test now measures the time from click to heading visible (4.5 s to 8 s) | Passed |

In addition, the "standard_user is faster" test now waits for the "Products" heading instead of the URL, and an unused import was removed. The healing was done by direct edits, not through the healer agent. No test needed more than 2 attempts and no test uses `test.fixme()`. No assertion was weakened to hide a defect: the 4.5 s to 8 s timing check still covers AC9.

### 3.4 Final execution

| Run | Result |
|-----|--------|
| Full suite | 30 passed, 0 failed (9.7 s) |
| Stability (`--repeat-each=3`) | 90 passed, 0 failed (18.6 s) |

| Suite | Tests | Passed | Failed |
|-------|-------|--------|--------|
| successful-login.spec.ts | 6 | 6 | 0 |
| negative-login.spec.ts | 9 | 9 | 0 |
| error-dismissal-ui.spec.ts | 4 | 4 | 0 |
| edge-cases.spec.ts | 6 | 6 | 0 |
| navigation.spec.ts | 5 | 5 | 0 |
| **Total** | **30** | **30** | **0** |

## 4. Defects Log

No test failed because of an application defect. The items below are low-severity documentation observations.

| Bug ID | Severity | Title | Description | Expected vs actual | Evidence |
|--------|----------|-------|-------------|--------------------|----------|
| OBS-01 | Low | User story AC1 misspells the username | AC1 says `standart_user`. Steps to reproduce: log in as `standart_user` / `secret_sauce` | Expected per story: login succeeds. Actual: "Username and password do not match any user in this service". The correct user is `standard_user` | [TC-12 results](../test-evidence/exploratory-testing-results.md), automated TC-12 |
| OBS-02 | Low | AC9 wording does not match the observed delay | AC9 says the user is redirected "with a 5 seconds delay". Steps: log in as `performance_glitch_user`, observe URL and heading | Expected per wording: redirect delayed. Actual: URL changes immediately, "Products" heading renders after about 5.1 s | [TC-04](../test-evidence/screenshots/TC-04-performance-glitch-inventory.png) |

Environment for both: Chromium, 1280x720, https://www.saucedemo.com, 2026-10-12.

Known behaviours that are expected per the user story and are not defects: `problem_user` placeholder images (AC7), `error_user` sort alert (AC8), `visual_user` placeholder image (AC10).

## 5. Test Coverage Analysis

| AC | Description | Manual | Automated |
|----|-------------|--------|-----------|
| AC1 | standard_user login | TC-01, 12, 13, 18, 25-29 | Yes |
| AC2 | locked_out_user error | TC-06 | Yes |
| AC3 | Empty username error | TC-07, 09, 14 | Yes |
| AC4 | Empty password error | TC-08, 14 | Yes |
| AC5 | Invalid credentials error | TC-10-14, 19-24 | Yes |
| AC6 | Dismiss with X, red error icons | TC-15-17 | Yes |
| AC7 | problem_user | TC-02, 29 | Yes (login and broken images) |
| AC8 | error_user | TC-03 | Yes (login and sort alert) |
| AC9 | performance_glitch_user delay | TC-04 | Yes (4.5 s to 8 s check) |
| AC10 | visual_user | TC-05 | Yes (login and placeholder image) |

Coverage: 10 of 10 acceptance criteria by both manual and automated tests.

Gaps:
- `problem_user` sort and checkout field bugs and `error_user` checkout errors (AC7, AC8) are not exercised beyond login and sort.
- `visual_user` layout differences are checked only through the product image, not with visual snapshots.
- Chromium only; no Firefox, WebKit or mobile viewport coverage (as required by the workflow).
- No accessibility or keyboard-only checks apart from submitting with Enter.

Recommendations: add checkout and sort scenarios for the glitch users, add screenshot comparison for `visual_user`, and correct the user story typo.

## 6. Summary and Recommendations

- **Quality assessment:** The login feature meets all 10 acceptance criteria in Chromium. Error messages are exact, validation is case and whitespace sensitive, and protected pages are not reachable without a session.
- **Risk areas:** the performance glitch delay makes timing-based assertions sensitive to load; the Back-after-logout URL varies between `/` and `/inventory.html`; the app depends on a third-party telemetry endpoint that returns 401.
- **Next steps:** fix the user story typo and AC9 wording, extend coverage for sort and checkout, and add other browsers if the scope changes.
