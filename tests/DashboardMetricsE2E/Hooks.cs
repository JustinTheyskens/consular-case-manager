namespace DashboardMetricsE2E;

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Reqnroll;

[Binding]
public class Hooks
{
    private readonly ScenarioContext _context;
    private IWebDriver _driver;

    public Hooks(ScenarioContext context)
    {
        _context = context;
    }

    [BeforeScenario]
    public void Setup()
    {
        _driver = new ChromeDriver();
        _driver.Manage().Window.Maximize();
        _context["WebDriver"] = _driver;
    }

    [AfterScenario]
    public void Teardown()
    {
        _driver?.Quit();
    }
}