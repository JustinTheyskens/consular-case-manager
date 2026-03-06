namespace API.Cases;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetCasesEmpty : BaseTest
{
    public GetCasesEmpty() : base("/cases") { }

    [Test]
    [Description("Tests the GET /cases route returns a status code 200")]
    public void GetCasesReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the GET /cases route returns an application/json")]
    public void GetCasesReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /cases returns an empty array")]
    public void GetCasesReturnsArray()
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
public class GetCasesNonEmpty : NonEmptyCaseTest
{
    [Test]
    [Description("Tests the GET /cases returns a length 1 array")]
    public void GetCasesReturnsArrayOfLengthOne()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/cases")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CasesResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
    }

    [Test]
    [Description("Tests the GET /cases returns an array with first element of the added element")]
    public void GetCasesReturnsArrayWithOneCitizens()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/cases")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CasesResponse[]>();

        var actual = response?[0];

        Assert.Multiple(() =>
        {
            Assert.That(actual?.Reference, Is.EqualTo(_caseRef));
            Assert.That(actual?.Citizen.FirstName, Is.EqualTo(mockCaseResponse.Citizen.FirstName));
            Assert.That(actual?.Citizen.LastName, Is.EqualTo(mockCaseResponse.Citizen.LastName));
            Assert.That(actual?.AssignedStaff.FirstName, Is.EqualTo(mockCaseResponse.AssignedStaff.FirstName));
            Assert.That(actual?.AssignedStaff.LastName, Is.EqualTo(mockCaseResponse.AssignedStaff.LastName));
            Assert.That(actual?.Appointment.Type, Is.EqualTo(mockCaseResponse.Appointment.Type));
            Assert.That(actual?.Appointment.Time, Is.EqualTo(mockCaseResponse.Appointment.Time));
            Assert.That(actual?.Status, Is.EqualTo(mockCaseResponse.Status));
            Assert.That(actual?.CheckedIn, Is.EqualTo(mockCaseResponse.CheckedIn));
            Assert.That(actual?.Flagged, Is.EqualTo(mockCaseResponse.Flagged));
        });
    }
}