namespace API.Staff;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PutStaffEmpty : BaseTest
{
    private static readonly StaffRequest basePutRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    public PutStaffEmpty() : base("/staff") { }

    [Test]
    [Description("Tests the PUT /staff/:id route with non-existant id returns a status code 404")]
    public void PutStaffMissingReturnsNotFound()
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
    [Description("Tests PUT /staff/:id route with an invalid staff ID returns a status code 500")]
    public void PutInvalidStaffIdReturnsInternalServerError()
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
public class PutStaffNonEmpty : BaseTest
{
    public PutStaffNonEmpty() : base("") { }
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

    private static readonly StaffRequest baseSecondaryRequest = new()
    {
        Email = "jane.doe@example.com",
        Password = "Test2",
        FirstName = "Jane",
        LastName = "Doe"
    };

    private static readonly StaffRequest basePutRequest = new()
    {
        Email = baseSecondaryRequest.Email,
        Password = baseRequest.Password,
        FirstName = baseSecondaryRequest.FirstName,
        LastName = baseRequest.LastName
    };

    private static readonly StaffResponse basePutResponse = new()
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
    [Description("Tests the PUT /staff/:id route with an empty body returns status code 500")]
    public void PutEmptyStaffReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Put($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the PUT /staff/:id route with an invalid body returns status code 500")]
    public void PutInvalidStaffReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body("{}")
        .When()
            .Put($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the PUT /staff/:id route returns status code 200")]
    public void PutStaffReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the PUT /staff/:id route returns an updated StaffResponse")]
    public void PutStaffReturnsUpdatedStaffResponse()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?.FirstName, Is.EqualTo(basePutResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(basePutResponse.LastName));
        });
    }

    [Test]
    [Description("Tests the PUT /staff/:id route correctly updates login credentials")]
    public void PutStaffUpdatesLoginCredentials()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(basePutRequest)
        .When()
            .Put($"/staff/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse>();

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
    [Description("Tests the PUT /staff/:id route with duplicate email returns status code 400")]
    public void PutDuplicateStaffReturnsBadRequest()
    {
        string secondaryId = EMPTY_ID;
        try
        {
            var response =
            Given()
                .Spec(_requestSpecification)
                .Body(baseSecondaryRequest)
            .When()
                .Post("/staff")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            secondaryId = (string)response;

            Given()
                .Spec(_requestSpecification)
                .Body(basePutRequest)
            .When()
                .Put($"/staff/{_id}")
            .Then()
                .StatusCode(HttpStatusCode.BadRequest);
        }
        finally
        {
            Given()
                .Spec(_requestSpecification)
            .When()
                .Delete($"/staff/{secondaryId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
    }

    [Test]
    [Description("Tests the PUT /staff/:id route with duplicate email rolls back changes")]
    public void PutDuplicateStaffDoesNotUpdate()
    {
        string secondaryId = EMPTY_ID;
        try
        {
            var response =
            Given()
                .Spec(_requestSpecification)
                .Body(baseSecondaryRequest)
            .When()
                .Post("/staff")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            secondaryId = (string)response;

            Given()
                .Spec(_requestSpecification)
                .Body(basePutRequest)
            .When()
                .Put($"/staff/{_id}")
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
                .Get($"/staff/{_id}")
            .Then()
                .StatusCode(HttpStatusCode.OK)
                .DeserializeTo<StaffResponse>();

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
                .Delete($"/staff/{secondaryId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
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