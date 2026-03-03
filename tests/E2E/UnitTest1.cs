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

}
