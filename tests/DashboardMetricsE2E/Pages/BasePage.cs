namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;

public class BasePage
{
    protected readonly IWebDriver Driver;
    protected readonly WebDriverWait Wait;

    public BasePage(IWebDriver driver)
    {
        Driver = driver;
        Wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
    }

    protected IWebElement WaitForElement(By locator)
    {
        return Wait.Until(d => d.FindElement(locator));
    }
}