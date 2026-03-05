namespace API.Citizens;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PostCitizens : BaseTest
{
    private string _id = EMPTY_ID;
    private static readonly CitizensRequest baseRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    private static readonly CitizensResponse baseResponse = new()
    {
        FirstName = baseRequest.FirstName,
        LastName = baseRequest.LastName
    };

    private static readonly LoginRequest loginRequest = new()
    {
        Email = baseRequest.Email,
        Password = baseRequest.Password
    };

    public PostCitizens() : base("") { }

    [Test]
    [Description("Tests the POST /citizens route returns a status code 201")]
    public void PostCitizensReturnsCreated()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;
    }

    [Test]
    [Description("Tests the POST /citizens route returns a CitizensResponse with correct fields")]
    public void PostCitizensReturnsCitizensResponse()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .DeserializeTo<CitizensResponse>();

        _id = response?._id!;

        Assert.Multiple(() =>
        {
            Assert.That(response?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(baseResponse.LastName));
        });
    }

    [Test]
    [Description("Tests the POST /citizens route creates login credentials")]
    public void PostCitizensCreatesLoginCredentials()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;

        var userId =
        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Extract().Body("$.userId");

        Assert.That(userId, Is.EqualTo(_id));
    }

    [Test]
    [Description("Tests the POST /citizens route with an empty body returns status code 500")]
    public void PostEmptyCitizensReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the POST /citizens route with an invalid body returns status code 500")]
    public void PostInvalidCitizensReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body("{}")
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the POST /citizens route with a duplicate email returns status code 400")]
    public void PostDuplicateCitizensReturnsBadRequest()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;

        CitizensRequest secondRequest = new()
        {
            Email = "john.doe@example.com",
            Password = "DuplicateTest",
            FirstName = "John",
            LastName = "Doe"
        };

        LoginRequest secondLoginRequest = new()
        {
            Email = secondRequest.Email,
            Password = secondRequest.Password
        };

        Given()
            .Spec(_requestSpecification)
            .Body(secondRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);

        Given()
            .Spec(_requestSpecification)
            .Body(secondLoginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);
    }

    [Test]
    [Description("Tests the POST /citizens route with a duplicate email does not create credentials")]
    public void PostDuplicateCitizensDoesNotCreateCredential()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;

        CitizensRequest secondRequest = new()
        {
            Email = "john.doe@example.com",
            Password = "DuplicateTest",
            FirstName = "John",
            LastName = "Doe"
        };

        Given()
            .Spec(_requestSpecification)
            .Body(secondRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);

        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
    }

    [TearDown]
    public void TeardownCitizens()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}