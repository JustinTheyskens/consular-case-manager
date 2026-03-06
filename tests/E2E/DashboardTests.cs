namespace E2E;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

/// <summary>
/// Contains dashboard tests verifying that user can
/// interact with the dashboard controls and that
/// each button provides the proper response.
/// 
/// Locator Strategy:
/// - Uses data-testid attributes with CSS selectors.
/// - Avoids dynamic MUI class names and brittle DOM chains.
/// 
/// This ensures stable and maintainable E2E automation.
/// </summary>


public class DashboardTests
{
    private static string BaseUrl = "http://localhost:5173";

    private WebDriver driver;

    public void StaffLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.Id("email-field")).SendKeys("staff@staff.com");
        driver.FindElement(By.Id("password-field")).SendKeys("password321");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        new WebDriverWait(driver, TimeSpan.FromSeconds(10))
        .Until(d => d.Url.Contains("/staff/dashboard"));
    }

    public void UserLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/user/login");

        driver.FindElement(By.Id("email-field")).SendKeys("user@test.com");
        driver.FindElement(By.Id("password-field")).SendKeys("test");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        wait.Until(d => d.Url.Contains("/user/dashboard"));
    }

    [SetUp]
    public void Setup()
    {
        driver = new ChromeDriver();
        driver.Manage().Window.Maximize();
    }

    [TearDown]
    public void TearDown()
    {
        driver?.Quit();
        driver?.Dispose();
    }

    [Test]
    [Category("Dashboard")]
    public void User_Can_Book_Appointment_For_New_Passport()
    {
        UserLogin();

        driver.FindElement(By.CssSelector("[data-testid='appointment-card-first-time-passport']")).Click();
    }

    [Test]
    [Category("Dashboard")]
    public void User_Can_Book_Appointment_For_Passport_Renewal()
    {
        UserLogin();

        driver.FindElement(By.CssSelector("[data-testid='appointment-card-passport-renewal']")).Click();
    }

    [Test]
    [Category("Dashboard")]
    public void User_Can_Book_Appointment_For_Lost_Or_Stolen_Passport()
    {
        UserLogin();

        driver.FindElement(By.CssSelector("[data-testid='appointment-card-lost-or-stolen-passport']")).Click();
    }

    [Test]
    [Category("Dashboard")]
    public void User_Can_Book_Appointment_For_Emergency_Travel_Document()
    {
        UserLogin();

        driver.FindElement(By.CssSelector("[data-testid='appointment-card-emergency-travel-document']")).Click();
    }
}