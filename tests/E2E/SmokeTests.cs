namespace E2E;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

    /// <summary>
    /// Contains smoke tests verifying that the Home page renders correctly.
    /// 
    /// Locator Strategy:
    /// - Uses data-testid attributes with CSS selectors.
    /// - Avoids dynamic MUI class names and brittle DOM chains.
    /// 
    /// This ensures stable and maintainable E2E automation.
    /// </summary>

public class SmokeTests
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

    [Test]
    [Category("Smoke")]
    public void HomePage_LoadsSuccessfully()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        var header = driver.FindElement(By.CssSelector("[data-testid='page-header']"));
        Assert.That(header.Text, Is.Not.Empty);
        Assert.That(header.Displayed, Is.True);               
    }

    [Test]
    [Category("Smoke")]
    public void HomePage_Can_Navigate_To_StaffLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        driver.FindElement(By.CssSelector("[data-testid='staff-login-btn']")).Click();
        Assert.That(driver.Url, Does.Contain("/staff/login"));
    }

    [Test]
    [Category("Smoke")]
    public void StaffUser_Can_Login_Successfully()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.Id("email-field")).SendKeys("staff@staff.com");
        driver.FindElement(By.Id("password-field")).SendKeys("password321");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        wait.Until(d => d.Url.Contains("/staff/dashboard"));

        Assert.That(driver.Url, Does.Contain("/dashboard"));
    }
    

    [Test]
    [Category("Smoke")]
    public void HomePage_Can_Navigate_To_UserLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        driver.FindElement(By.CssSelector("[data-testid='user-login-btn']")).Click();
        Assert.That(driver.Url, Does.Contain("/user/login"));
    }

    [Test]
    [Category("Smoke")]
    public void User_Can_Login_Successfully()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/user/login");

        driver.FindElement(By.Id("email-field")).SendKeys("user@test.com");
        driver.FindElement(By.Id("password-field")).SendKeys("test");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        wait.Until(d => d.Url.Contains("/user/dashboard"));

        Assert.That(driver.Url, Does.Contain("/dashboard"));

        // var header = driver.FindElement(By.CssSelector("[data-testid='user-dashboard']"));
        // Assert.That(header.Text, Is.Not.Empty);
        
    }
}
