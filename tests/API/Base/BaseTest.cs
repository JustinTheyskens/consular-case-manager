using Newtonsoft.Json.Serialization;
using RestAssured.Logging;
using RestAssured.Request.Builders;

namespace API.Base;

public abstract class BaseTest
{
    protected RequestSpecification _requestSpecification;
    protected const string EMPTY_ID = "000000000000000000000000";

    public BaseTest(string path)
    {
        DotNetEnv.Env.Load();
        var logConfiguration = new LogConfiguration
        {
            RequestLogLevel = RequestLogLevel.None,
            ResponseLogLevel = ResponseLogLevel.None,
        };

        string url = Environment.GetEnvironmentVariable("API_URL") ?? "http://localhost";
        int port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "8080");

        _requestSpecification = new RequestSpecBuilder()
            .WithBaseUri(url)
            .WithPort(port)
            .WithBasePath(path)
            .WithJsonSerializerSettings(new()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            })
            .WithLogConfiguration(logConfiguration)
            .Build();
    }
}