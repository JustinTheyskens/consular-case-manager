namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using System.Threading;

public class StaffAnalyticsPage : BasePage
{
    public StaffAnalyticsPage(IWebDriver driver) : base(driver) {}

    public string GetRenewals()
    {
        var Renewals =
            WaitForElement(By.XPath("//h6[text()='Total Renewals']/following-sibling::h6")).Text;
            
        return Renewals;
    }

    public string GetNoShowsAndCancels()
    {
        var NoShowsAndCancels =
            WaitForElement(By.XPath("//h6[text()='Total No Show or Cancel out of all Cases']/following-sibling::h6")).Text;
            
        return NoShowsAndCancels;
    }

    public string GetTotalCases()
    {
        var TotalCases =
            WaitForElement(By.XPath("//h6[contains(text(),'Cases History')]")).Text;
            
        return TotalCases;
    }

    public void ApplyFilter()
    {
        var startMonth = WaitForElement(By.XPath("//span[@aria-label='Month' and @data-range-position='start']"));
        startMonth.Click();
        startMonth.SendKeys("03");

        var startDay = WaitForElement(By.XPath("//span[@aria-label='Day' and @data-range-position='start']"));
        startDay.Click();
        startDay.SendKeys("06");

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

    public void ClickExport()
    {
        var exportButton = 
            WaitForElement(By.XPath("//button[normalize-space()='Export Selected Cases']"));

        exportButton.Click();

        Thread.Sleep(2000);
    }

    public int CountDownloadedCSVs()
    {
        string downloadPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            "Downloads"
        );

        return Directory.GetFiles(downloadPath, "*.csv").Length;
    }
}