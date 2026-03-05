namespace API.Citizens;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetCitizensEmpty : BaseTest
{
    public GetCitizensEmpty() : base("/citizens") { }

    [Test]
    [Description("Tests the GET /citizens route returns a status code 200")]
    public void GetCitizensReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the GET /citizens route returns an application/json")]
    public void GetCitizensReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /citizens returns an empty array")]
    public void GetCitizensReturnsArray()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .And()
            .Body("$", NHamcrest.Is.OfLength(0));
    }
}

[TestFixture]
public class GetCitizensNonEmpty : BaseTest
{
    public GetCitizensNonEmpty() : base("/citizens") { }
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
        var id = Given()
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
    [Description("Tests the GET /citizens returns a length 1 array")]
    public void GetCitizensReturnsArrayOfLengthOne()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
    }

    [Test]
    [Description("Tests the GET /citizens returns an array with first element of the added element")]
    public void GetCitizensReturnsArrayWithOneCitizens()
    {
        var response = 
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CitizensResponse[]>();

        var actual = response?[0];

        Assert.Multiple(() =>
        {
            Assert.That(actual?._id, Is.EqualTo(_id));
            Assert.That(actual?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(actual?.LastName, Is.EqualTo(baseResponse.LastName));
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