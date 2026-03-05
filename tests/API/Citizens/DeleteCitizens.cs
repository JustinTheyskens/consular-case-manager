namespace API.Citizens;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class DeleteCitizensEmpty : BaseTest
{
    public DeleteCitizensEmpty() : base("/citizens") { }

    [Test]
    [Description("Tests the DELETE /citizens/:id route returns a status code 204")]
    public void DeleteCitizensReturnsNoContent()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [Test]
    [Description("Tests DELETE /citizens/:id route with an invalid citizens ID returns a status code 500")]
    public void DeleteInvalidCitizensIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the DELETE /citizens/:id route returns an empty body")]
    public void DeleteCitizensReturnsEmptyBody()
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
public class DeleteCitizensNonEmpty : BaseTest
{
    public DeleteCitizensNonEmpty() : base("") { }
    private string _id = EMPTY_ID;
    private static readonly CitizensRequest baseRequest = new()
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
    public void SetupCitizens()
    {
        var id = Given()
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
    [Description("Tests that after a DELETE /citizens/:id the citizens with given id cannot be found")]
    public void DeleteCitizensRemovesCitizensWithGivenId()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests the DELETE /citizens/:id removes the login credentials for given citizens")]
    public void DeleteCitizensRemovesLoginForGivenCitizens()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/citizens/{_id}")
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