namespace API.Citizens;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PutCitizensEmpty : BaseTest
{
    private static readonly CitizensRequest basePutRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    public PutCitizensEmpty() : base("/citizens") { }

    [Test]
    [Description("Tests the PUT /citizens/:id route with non-existant id returns a status code 404")]
    public void PutCitizensMissingReturnsNotFound()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests PUT /citizens/:id route with an invalid citizens ID returns a status code 500")]
    public void PutInvalidCitizensIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }
}

[TestFixture]
public class PutCitizensNonEmpty : BaseTest
{
    public PutCitizensNonEmpty() : base("") { }
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

    private static readonly CitizensRequest baseSecondaryRequest = new()
    {
        Email = "jane.doe@example.com",
        Password = "Test2",
        FirstName = "Jane",
        LastName = "Doe"
    };

    private static readonly CitizensRequest basePutRequest = new()
    {
        Email = baseSecondaryRequest.Email,
        Password = baseRequest.Password,
        FirstName = baseSecondaryRequest.FirstName,
        LastName = baseRequest.LastName
    };

    private static readonly CitizensResponse basePutResponse = new()
    {
        FirstName = baseSecondaryRequest.FirstName,
        LastName = baseRequest.LastName
    };

    private static readonly LoginRequest loginRequest = new()
    {
        Email = baseRequest.Email,
        Password = baseRequest.Password
    };

    private static readonly LoginRequest updatedLoginRequest = new()
    {
        Email = baseSecondaryRequest.Email,
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
    [Description("Tests the PUT /citizens/:id route with an empty body returns status code 500")]
    public void PutEmptyCitizensReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Put($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route with an invalid body returns status code 500")]
    public void PutInvalidCitizensReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body("{}")
        .When()
            .Put($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route returns status code 200")]
    public void PutCitizensReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route returns an updated CitizensResponse")]
    public void PutCitizensReturnsUpdatedCitizensResponse()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?.FirstName, Is.EqualTo(basePutResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(basePutResponse.LastName));
        });
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route correctly updates login credentials")]
    public void PutCitizensUpdatesLoginCredentials()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/citizens/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse>();

        Given()
            .Spec(_requestSpecification)
            .Body(loginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.Unauthorized);

        var userId =
        Given()
            .Spec(_requestSpecification)
            .Body(updatedLoginRequest)
        .When()
            .Post("/login")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Extract().Body("$.userId");

        Assert.That(userId, Is.EqualTo(_id));
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route with duplicate email returns status code 400")]
    public void PutDuplicateCitizensReturnsBadRequest()
    {
        string secondaryId = EMPTY_ID;
        try
        {
            var response =
            Given()
                .Spec(_requestSpecification)
                .Body(baseSecondaryRequest)
            .When()
                .Post("/citizens")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            secondaryId = (string)response;

            Given()
                .Spec(_requestSpecification)
                .Body(basePutRequest)
            .When()
                .Put($"/citizens/{_id}")
            .Then()
                .StatusCode(HttpStatusCode.BadRequest);
        }
        finally
        {
            Given()
                .Spec(_requestSpecification)
            .When()
                .Delete($"/citizens/{secondaryId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
    }

    [Test]
    [Description("Tests the PUT /citizens/:id route with duplicate email rolls back changes")]
    public void PutDuplicateCitizensDoesNotUpdate()
    {
        string secondaryId = EMPTY_ID;
        try
        {
            var response =
            Given()
                .Spec(_requestSpecification)
                .Body(baseSecondaryRequest)
            .When()
                .Post("/citizens")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            secondaryId = (string)response;

            Given()
                .Spec(_requestSpecification)
                .Body(basePutRequest)
            .When()
                .Put($"/citizens/{_id}")
            .Then()
                .StatusCode(HttpStatusCode.BadRequest);

            Given()
                .Spec(_requestSpecification)
                .Body(loginRequest)
            .When()
                .Post("/login")
            .Then()
                .StatusCode(HttpStatusCode.OK);

            Given()
                .Spec(_requestSpecification)
                .Body(updatedLoginRequest)
            .When()
                .Post("/login")
            .Then()
                .StatusCode(HttpStatusCode.Unauthorized);

            var updatedResponse = Given()
                .Spec(_requestSpecification)
            .When()
                .Get($"/citizens/{_id}")
            .Then()
                .StatusCode(HttpStatusCode.OK)
                .DeserializeTo<CitizensResponse>();

            Assert.Multiple(() =>
            {
                Assert.That(updatedResponse?.FirstName, Is.EqualTo(baseResponse.FirstName));
                Assert.That(updatedResponse?.LastName, Is.EqualTo(baseResponse.LastName));
            });
        }
        finally
        {
            Given()
                .Spec(_requestSpecification)
            .When()
                .Delete($"/citizens/{secondaryId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
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