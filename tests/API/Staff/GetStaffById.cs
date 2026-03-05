namespace API.Staff;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetStaffByIdEmpty : BaseTest
{
    public GetStaffByIdEmpty() : base("/staff") { }

    [Test]
    [Description("Tests GET /staff/:id route with a missing ID returns a status code 404")]
    public void GetMissingStaffIdReturnsNotFound()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests GET /staff/:id route with an invalid staff ID returns a status code 500")]
    public void GetInvalidStaffIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }
}

[TestFixture]
public class GetStaffByIdNonEmpty : BaseTest
{
    public GetStaffByIdNonEmpty() : base("/staff") { }
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

    [SetUp]
    public void SetupStaff()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(baseRequest)
        .When()
            .Post("/")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _id = (string)id;
    }

    [Test]
    [Description("Tests the GET /staff/:id route returns an application/json")]
    public void GetStaffReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /staff/:id returns a staff object")]
    public void GetValidStaffIdReturnsStaffObject()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Body("$", NHamcrest.Is.InstanceOf<StaffResponse>());
    }

    [Test]
    [Description("Tests the GET /staff/:id returns an array with first element of the added element")]
    public void GetValidStaffIdReturnsArrayWithAddedStaff()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?._id, Is.EqualTo(_id));
            Assert.That(response?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(baseResponse.LastName));
        });
    }

    [TearDown]
    public void TeardownStaff()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}