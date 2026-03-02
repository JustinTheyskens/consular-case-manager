namespace E2E;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

public class ExamplePageTests
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
        //driver.Quit();
        driver.Dispose();
    }

    [Test]
    public void Test()
    {
        Assert.Pass();
    }

    [Test]
    public void HomePage_LoadsSuccessfully()
    {
        driver.Navigate().GoToUrl(BaseUrl);

        var header = driver.FindElement(By.TagName("h1"));
        Assert.That(header.Text, Is.Not.Empty);

        //Assert.That(driver.FindElement(By.Id("page-header")).Displayed);
    }

    [Test]
    public void StaffUser_Can_Login_Successfully()
    {
        driver.Navigate().GoToUrl(BaseUrl + "/staff/login");

        driver.FindElement(By.Id("email")).SendKeys("staff@test.com");
        driver.FindElement(By.Id("password")).SendKeys("Password123!");
        driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        Assert.That(driver.Url, Does.Contain("/dashboard"));
    }

}
