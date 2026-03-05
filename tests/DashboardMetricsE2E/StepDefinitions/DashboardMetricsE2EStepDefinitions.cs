namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Reqnroll;
using NUnit.Framework;
using System;

[Binding]
public class DashboardMetricsSteps
{
    private readonly IWebDriver _driver;

    private HomePage _home;
    private StaffLoginPage _staffLogin;
    private StaffDashboardPage _staffDashboard;
    private StaffAnalyticsPage _staffAnalytics;

    private string _initialScheduled;

    public DashboardMetricsSteps(ScenarioContext context)
    {
        _driver = context["WebDriver"] as IWebDriver
            ?? throw new ArgumentNullException("WebDriver not found in ScenarioContext");

        _home = new HomePage(_driver);
        _staffLogin = new StaffLoginPage(_driver);
        _staffDashboard = new StaffDashboardPage(_driver);
        _staffAnalytics = new StaffAnalyticsPage(_driver);
    }

    [Given("I am on the homepage")]
    public void GivenIAmOnTheHomepage()
    {
        _home.NavigateToHomepage();
    }

    [When("I click the Staff Login button")]
    public void WhenIClickTheStaffLoginButton()
    {
        _home.ClickStaffLogin();
    }

    [When("I enter valid staff credentials")]
    public void WhenIEnterValidStaffCredentials()
    {
        _staffLogin.Login("chuckfinley@email.com", "MemeBaseAlpha123");
    }

    [When("I click the View System Analytics button")]
    public void WhenIClicktheViewSystemAnalyticsButton()
    {
        _staffDashboard.GoToAnalytics();
    }

    [When("I apply a date filter")]
    public void WhenIApplyADateFilter()
    {
        _initialScheduled = _staffAnalytics.GetScheduled();

        _staffAnalytics.ApplyFilter();
    }

    [Then("the analytics charts should update")]
    public void ThenTheAnalyticsChartsShouldUpdate()
    {
        var newScheduled = _staffAnalytics.GetScheduled();

        Assert.That(newScheduled, Is.Not.EqualTo(_initialScheduled));
    }
}