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
        var startMonth = WaitForElement(By.XPath("//span[@aria-label='Month' and @data-range-position='start']"));
        startMonth.Click();
        startMonth.SendKeys("03");

        var startDay = WaitForElement(By.XPath("//span[@aria-label='Day' and @data-range-position='start']"));
        startDay.Click();
        startDay.SendKeys("05");

        var startYear = WaitForElement(By.XPath("//span[@aria-label='Year' and @data-range-position='start']"));
        startYear.Click();
        startYear.SendKeys("2026");

        var endMonth = WaitForElement(By.XPath("//span[@aria-label='Month' and @data-range-position='end']"));
        endMonth.Click();
        endMonth.SendKeys("03");

        var endDay = WaitForElement(By.XPath("//span[@aria-label='Day' and @data-range-position='end']"));
        endDay.Click();
        endDay.SendKeys("31");

        var endYear = WaitForElement(By.XPath("//span[@aria-label='Year' and @data-range-position='end']"));
        endYear.Click();
        endYear.SendKeys("2026");
    }
}