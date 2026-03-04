namespace E2E;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

/// <summary>
/// Contains authentication tests verifying that user with proper
/// credentials are router to the dashboard, while user with
/// improper credentials are shown an error message.
/// 
/// Locator Strategy:
/// - Uses data-testid attributes with CSS selectors.
/// - Avoids dynamic MUI class names and brittle DOM chains.
/// 
/// This ensures stable and maintainable E2E automation.
/// </summary>

public class AuthenticationTests
{
    private static string BaseUrl = "http://localhost:5173";
    private WebDriver driver;

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

    
    public void Login()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.Id("email-field")).SendKeys("justin@gmail.com");
        driver.FindElement(By.Id("password-field")).SendKeys("abacabb");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        new WebDriverWait(driver, TimeSpan.FromSeconds(10))
        .Until(d => d.Url.Contains("/staff/dashboard"));
    }

    [Test]
    [Category("Authentication")]
    public void Login_With_Valid_Credentials_Redirects_To_Dashboard()
    {
        Login();

        Assert.That(driver.Url, Does.Contain("/dashboard"));       
    }

    [Test]
    [Category("Authentication")]
    public void Login_With_Invalid_Password_Shows_Error_Message()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.Id("email-field")).SendKeys("justin@gmail.com");
        driver.FindElement(By.Id("password-field")).SendKeys("wrongpassword");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        var errorMessage = wait.Until(d =>
            d.FindElement(By.CssSelector("[data-testid='login-error']"))
        );

        Assert.That(errorMessage.Displayed, Is.True);          
    }

    [Test]
    [Category("Authentication")]
    public void Login_With_Empty_Fields_Shows_Error_Message()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        var errorMessage = wait.Until(d =>
            d.FindElement(By.CssSelector("[data-testid='login-error']"))
        );

        Assert.That(errorMessage.Displayed, Is.True);  
    }


    [Test]
    [Category("Authentication")]
    [Ignore("Route protection hasn't been implemented yet.")]
    public void Unauthenticated_User_Cannot_Access_Dashboard()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/dashboard");

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));

        wait.Until(d => d.Url.Contains("/staff/login"));

        Assert.That(driver.Url, Does.Contain("/staff/login"));       
    }

    [Test]
    [Category("Authentication")]
    public void Logout_Clears_Session_And_Redirects_To_Login()
    {
        Login();

        var loginWait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
        loginWait.Until(d => d.Url.Contains("/staff/dashboard"));

        driver.FindElement(By.CssSelector("[data-testid='logout-btn']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
        wait.Until(d => d.Url.Contains("/staff/login"));

        Assert.That(driver.Url, Does.Contain("/staff/login"));
    }
}