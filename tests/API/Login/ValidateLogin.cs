namespace API.Login;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class ValidateLoginEmpty : BaseTest
{
    private static readonly LoginRequest loginRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test"
    };
    public ValidateLoginEmpty() : base("/login") { }

    [Test]
    [Description("Tests that validating an empty body returns status 401")]
    public void PostEmptyLoginReturnsUnauthorized()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Post("/")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);
    }

    [Test]
    [Description("Tests that validating an invalid body returns status 401")]
    public void PostInvalidLoginReturnsUnauthorized()
    {
        Given()
            .Spec(_requestSpecification)
            .Body("{ }")
        .When()
            .Post("/")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);
    }

    [Test]
    [Description("Tests that validating a non-existant email/password returns status 401")]
    public void PostNonExistantLoginReturnsUnauthorized()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
        .When()
            .Post("/")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);
    }
}

[TestFixture]
public class ValidateLoginNonEmpty : BaseTest
{
    private string _id = EMPTY_ID;
    private static readonly StaffRequest baseRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    private static readonly LoginRequest loginRequest = new()
    {
        Email = baseRequest.Email,
        Password = baseRequest.Password
    };

    private static readonly LoginRequest badLoginRequest = new()
    {
        Email = baseRequest.Email,
        Password = "INCORRECT"
    };

    public ValidateLoginNonEmpty() : base("") { }

    [SetUp]
    public void SetupStaff()
    {
        var id = Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;
    }

    [Test]
    [Description("Tests that validating a correct email/password pair returns status code 200")]
    public void PostLoginCorrectEmailPasswordReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests that validating a correct email/password pair returns ID of the object")]
    public void PostLoginCorrectEmailPasswordReturnsCorrectReference()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Body("$.userId", NHamcrest.Is.EqualTo(_id));
    }

    [Test]
    [Description("Tests that validating a correct email but incorrect password returns status code 401")]
    public void PostLoginCorrectEmailIncorrectPasswordReturnsUnauthorized()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(badLoginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);
    }

    [TearDown]
    public void TeardownStaff()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}