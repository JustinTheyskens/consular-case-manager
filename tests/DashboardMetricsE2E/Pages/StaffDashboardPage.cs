namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

public class StaffDashboardPage : BasePage
{
    public StaffDashboardPage(IWebDriver driver) : base(driver) {}

    private IWebElement AnalyticsButton =>
        WaitForElement(By.LinkText("View System Analytics"));

    public void GoToAnalytics()
    {
        AnalyticsButton.Click();
    }
}