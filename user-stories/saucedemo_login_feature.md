User Story: Saucedemo-ecommerce Login Process
Story Title

As a registered customer, I want to login to user accounts with Accepted usernames and password So that I can browse and purchase products.
Story Description

Implement a complete login flow that allows customers to login, confirm that the main page is opened, and provide clear feedback at each step.
Application URL
https://www.saucedemo.com

Test Credentials:
Usernames:    
    standard_user
    locked_out_user
    problem_user
    performance_glitch_user
    error_user
    visual_user
Password: secret_sauce

**Acceptance Criteria**
1. `standart_user` + `secret_sauce` redirects to `/inventory.html` showing "Products".
2. `locked_out_user` sees error: *"Epic sadface: Sorry, this user has been locked out."*
3. Empty username shows: *"Epic sadface: Username is required"*.
4. Empty password shows: *"Epic sadface: Password is required"*.
5. Invalid credentials show: *"Epic sadface: Username and password do not match any user in this service"*.
6. Error can be dismissed with the "X" button; fields show red error icons.
7. `problem_user` + `secret_sauce` redirects to `/inventory.html` showing "Products". There are known UI bugs (wrong images, broken sort/checkout fields)
8. `error_user` + `secret_sauce` redirects to `/inventory.html` showing "Products". There are errors on some actions (sort, checkout)
9. `performance_glitch_user` + `secret_sauce` redirects to `/inventory.html` showing "Products" with a 5 seconds delay.
10. `visual_user` + `secret_sauce` redirects to `/inventory.html` showing "Products" with visual/layout discrepancies on page.

Business Rules

    Users must be logged in to account with products verification
    

Technical Notes

    Use Playwright for test automation
    Test in Chrome browser only
    Test navigation flow and back button behavior
    Use fixtures for test optimization 
    Use Page object modal for test optimization 

Definition of Done

    [] All acceptance criteria have test cases
    [] Manual exploratory testing completed
    [] Automated test scripts created and passing
    [] Test results documented
    [] Bugs logged for any failures
    [] Code committed to repository
