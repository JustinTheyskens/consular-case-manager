namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

public class StaffAnalyticsPage : BasePage
{
    public StaffAnalyticsPage(IWebDriver driver) : base(driver) {}

    public string GetScheduled()
    {
        var Scheduled =
            WaitForElement(By.XPath("//h6[text()='Scheduled']/following-sibling::h6")).Text;
            
        return Scheduled;
    }

    public void ApplyFilter()
    {
        var filterDropdown = WaitForElement(By.XPath("//div[@role='combobox']"));
        filterDropdown.Click();
        var filterOption = WaitForElement(By.XPath("//li[normalize-space()='30 days ahead']"));
        filterOption.Click();
    }
}