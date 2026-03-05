namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

public class StaffLoginPage : BasePage
{
    public StaffLoginPage(IWebDriver driver) : base(driver) {}

    private IWebElement Email =>
        WaitForElement(By.Id("email-field"));

    private IWebElement Password =>
        WaitForElement(By.Id("password-field"));

    private IWebElement LoginButton =>
        WaitForElement(By.CssSelector("button[type='submit']"));

    public void Login(string email, string password)
    {
        Email.SendKeys(email);
        Password.SendKeys(password);
        LoginButton.Click();
    }
}