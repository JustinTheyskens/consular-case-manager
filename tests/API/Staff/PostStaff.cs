namespace API.Staff;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PostStaff : BaseTest
{
    private string _id = EMPTY_ID;
    private static readonly StaffRequest baseRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    private static readonly StaffResponse baseResponse = new()
    {
        FirstName = baseRequest.FirstName,
        LastName = baseRequest.LastName
    };

    private static readonly LoginRequest loginRequest = new()
    {
        Email = baseRequest.Email,
        Password = baseRequest.Password
    };

    public PostStaff() : base("") { }

    [Test]
    [Description("Tests the POST /staff route returns a status code 201")]
    public void PostStaffReturnsCreated()
    {
        var id =
        Given()
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
    [Description("Tests the POST /staff route returns a StaffResponse with correct fields")]
    public void PostStaffReturnsStaffResponse()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .DeserializeTo<StaffResponse>();

        _id = response?._id!;

        Assert.Multiple(() =>
        {
            Assert.That(response?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(baseResponse.LastName));
        });
    }

    [Test]
    [Description("Tests the POST /staff route creates login credentials")]
    public void PostStaffCreatesLoginCredentials()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/staff")
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
    [Description("Tests the POST /staff route with an empty body returns status code 500")]
    public void PostEmptyStaffReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the POST /staff route with an invalid body returns status code 500")]
    public void PostInvalidStaffReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body("{}")
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the POST /staff route with a duplicate email returns status code 400")]
    public void PostDuplicateStaffReturnsBadRequest()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;

        StaffRequest secondRequest = new()
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
            .Post("/staff")
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
    [Description("Tests the POST /staff route with a duplicate email does not create credentials")]
    public void PostDuplicateStaffDoesNotCreateCredential()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;

        StaffRequest secondRequest = new()
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
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);

        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/staff")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
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