namespace E2E;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

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
    public void HomePage_LoadsSuccessfully()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        var header = driver.FindElement(By.CssSelector("[data-testid='page-header']"));
        Assert.That(header.Text, Is.Not.Empty);
        Assert.That(header.Displayed, Is.True);

        //Assert.That(driver.FindElement(By.Xpath("//*[@id='root']/div/div/div[1]/h1")).Displayed);
                 
    }

    [Test]
    public void HomePage_Can_Navigate_To_StaffLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        driver.FindElement(By.CssSelector("[data-testid='staff-login-btn']")).Click();
        //driver.FindElement(By.CssSelector("[data-testid='AdminPanelSettingsIcon']")).Click();
        Assert.That(driver.Url, Does.Contain("/staff/login"));
    }

    // [Test]
    // public void StaffUser_Can_Login_Successfully()
    // {
    //     driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

    //     driver.FindElement(By.Id("email")).SendKeys("staff@test.com");
    //     driver.FindElement(By.Id("password")).SendKeys("Password123!");
    //     driver.FindElement(By.CssSelector("button[type='submit']")).Click();

    //     Assert.That(driver.Url, Does.Contain("/dashboard"));
    // }
    

    [Test]
    public void StaffUser_Can_Acess_Dashboard()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/dashboard");
        var header = driver.FindElement(By.CssSelector("[data-testid='todays-schedule']"));
        Assert.That(header.Text, Is.Not.Empty);
    }

    [Test]
    public void HomePage_Can_Navigate_To_UserLogin()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        driver.FindElement(By.CssSelector("[data-testid='user-login-btn']")).Click();
        //driver.FindElement(By.CssSelector("[data-testid='AdminPanelSettingsIcon']")).Click();
        Assert.That(driver.Url, Does.Contain("/user/login"));
    }

    [Test]
    public void CitizenUser_Can_Acess_Dashboard()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/user/dashboard");
        var header = driver.FindElement(By.CssSelector("[data-testid='user-dashboard']"));
        Assert.That(header.Text, Is.Not.Empty);
    }
}
