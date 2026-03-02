namespace E2E;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

public class ExamplePageTests
{
    private WebDriver _driver;
    [SetUp]
    public void Setup()
    {
        _driver = new ChromeDriver();
    }

    [TearDown]
    public void Teardown()
    {
        _driver.Close();
    }

    [Test]
    public void Test()
    {
        Assert.Pass();
    }

}
