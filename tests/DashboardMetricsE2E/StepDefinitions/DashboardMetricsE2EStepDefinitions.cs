namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Reqnroll;
using NUnit.Framework;
using System;
using System.Runtime.CompilerServices;

[Binding]
public class DashboardMetricsSteps
{
    private readonly IWebDriver _driver;

    private HomePage _home;
    private StaffLoginPage _staffLogin;
    private StaffDashboardPage _staffDashboard;
    private StaffAnalyticsPage _staffAnalytics;

    private string _initialRenewals;
    private string _initialTotalCases;
    private int _initialNumCSVs;

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
    public void WhenIClickTheViewSystemAnalyticsButton()
    {
        _staffDashboard.GoToAnalytics();
    }

    [When("I apply a date filter")]
    public void WhenIApplyADateFilter()
    {
        _initialRenewals = _staffAnalytics.GetRenewals();
        _initialTotalCases = _staffAnalytics.GetTotalCases();

        _staffAnalytics.ApplyFilter();
    }

    [When("I click the Export Selected Cases button")]
    public void WhenIClickTheExportSelectedCasesButton()
    {
        _initialNumCSVs = _staffAnalytics.CountDownloadedCSVs();

        _staffAnalytics.ClickExport();
    }

    [Then("the analytics charts should update")]
    public void ThenTheAnalyticsChartsShouldUpdate()
    {
        var newRenewals = _staffAnalytics.GetRenewals();
        var newTotalCases = _staffAnalytics.GetTotalCases();

        Assert.Multiple(() =>
        {
            Assert.That(newRenewals, Is.Not.EqualTo(_initialRenewals));
            Assert.That(newTotalCases, Is.Not.EqualTo(_initialTotalCases));
        });
    }

    [Then("the csv should be downloaded")]
    public void ThenTheCsvShouldBeDownloaded()
    {
        var newNumCSVs = _staffAnalytics.CountDownloadedCSVs();

        Assert.That(newNumCSVs, Is.Not.EqualTo(_initialNumCSVs));
    }
}