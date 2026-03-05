namespace API.Citizens;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetCitizensByIdEmpty : BaseTest
{
    public GetCitizensByIdEmpty() : base("/citizens") { }

    [Test]
    [Description("Tests GET /citizens/:id route with a missing ID returns a status code 404")]
    public void GetMissingCitizensIdReturnsNotFound()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests GET /citizens/:id route with an invalid citizens ID returns a status code 500")]
    public void GetInvalidCitizensIdReturnsInternalServerError()
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
public class GetCitizensByIdNonEmpty : BaseTest
{
    public GetCitizensByIdNonEmpty() : base("/citizens") { }
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

    [SetUp]
    public void SetupCitizens()
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
    [Description("Tests the GET /citizens/:id route returns an application/json")]
    public void GetCitizensReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /citizens/:id returns a citizens object")]
    public void GetValidCitizensIdReturnsCitizensObject()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Body("$", NHamcrest.Is.InstanceOf<CitizensResponse>());
    }

    [Test]
    [Description("Tests the GET /citizens/:id returns an array with first element of the added element")]
    public void GetValidCitizensIdReturnsArrayWithAddedCitizens()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?._id, Is.EqualTo(_id));
            Assert.That(response?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(response?.LastName, Is.EqualTo(baseResponse.LastName));
        });
    }

    [TearDown]
    public void TeardownCitizens()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{_id}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}