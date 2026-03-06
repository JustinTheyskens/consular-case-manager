Feature: Dashboard Metrics E2E
    Scenario: Navigate to staff dashboard
        Given I am on the homepage
        When I click the Staff Login button
        And I enter valid staff credentials
        And I click the View System Analytics button
        And I apply a date filter
        And I click the Export Selected Cases button
        Then the analytics charts should update
        And the csv should be downloaded