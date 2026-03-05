namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

public class HomePage : BasePage
{
    public HomePage(IWebDriver driver) : base(driver) {}
    
    private IWebElement StaffLoginCard =>
        WaitForElement(By.XPath("//h6[normalize-space()='Staff Login']"));

    public void NavigateToHomepage()
    {
        Driver.Navigate().GoToUrl("http://localhost:5173");
    }

    public void ClickStaffLogin()
    {
        StaffLoginCard.Click();
    }
}