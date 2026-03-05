namespace API.Staff;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class DeleteStaffEmpty : BaseTest
{
    public DeleteStaffEmpty() : base("/staff") { }

    [Test]
    [Description("Tests the DELETE /staff/:id route with non-existant id returns a status code 204")]
    public void DeleteStaffReturnsNoContent()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [Test]
    [Description("Tests DELETE /staff/:id route with an invalid staff ID returns a status code 500")]
    public void DeleteInvalidStaffIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the DELETE /staff/:id route returns an empty body")]
    public void DeleteStaffReturnsEmptyBody()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{EMPTY_ID}")
        .Then()
            .Body(NHamcrest.Is.EqualTo(""));
    }
}

[TestFixture]
public class DeleteStaffNonEmpty : BaseTest
{
    public DeleteStaffNonEmpty() : base("") { }
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
    [Description("Tests that after a DELETE /staff/:id the staff with given id cannot be found")]
    public void DeleteStaffRemovesStaffWithGivenId()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests the DELETE /staff/:id removes the login credentials for given staff")]
    public void DeleteStaffRemovesLoginForGivenStaff()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
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