namespace API.Staff;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetStaffEmpty : BaseTest
{
    public GetStaffEmpty() : base("/staff") { }

    [Test]
    [Description("Tests the GET /staff route returns a status code 200")]
    public void GetStaffReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the GET /staff route returns an application/json")]
    public void GetStaffReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /staff returns an empty array")]
    public void GetStaffReturnsArray()
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
public class GetStaffNonEmpty : BaseTest
{
    public GetStaffNonEmpty() : base("/staff") { }
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
    [Description("Tests the GET /staff returns a length 1 array")]
    public void GetStaffReturnsArrayOfLengthOne()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
    }

    [Test]
    [Description("Tests the GET /staff returns an array with first element of the added element")]
    public void GetStaffReturnsArrayWithOneStaff()
    {
        var response = 
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<StaffResponse[]>();

        var actual = response?[0];

        Assert.Multiple(() =>
        {
            Assert.That(actual?._id, Is.EqualTo(_id));
            Assert.That(actual?.FirstName, Is.EqualTo(baseResponse.FirstName));
            Assert.That(actual?.LastName, Is.EqualTo(baseResponse.LastName));
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