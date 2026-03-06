namespace API.Cases;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetCasesByRefEmpty : BaseTest
{
    public GetCasesByRefEmpty() : base("/cases") { }

    [Test]
    [Description("Tests the GET /cases:ref with non-existant ref route returns a status code 404")]
    public void GetCasesReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/0")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests the GET /cases:ref with invalid ref route returns a status code 500")]
    public void GetCasesInvalid()
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
public class GetCasesByRefNonEmpty : NonEmptyCaseTest
{
    [Test]
    [Description("Tests the GET /cases/:ref route returns an application/json")]
    public void GetCasesReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/cases/{_caseRef}")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /cases/:ref returns a length 1 array")]
    public void GetCasesReturnsArrayOfLengthOne()
    {
        var response = Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .Body("$", NHamcrest.Is.InstanceOf<CasesResponse>());
    }

    [Test]
    [Description("Tests the GET /cases/:ref returns an array with first element of the added element")]
    public void GetCasesReturnsArrayWithOneCitizens()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<CasesResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?.Reference, Is.EqualTo(_caseRef));
            Assert.That(response?.Citizen.FirstName, Is.EqualTo(mockCaseResponse.Citizen.FirstName));
            Assert.That(response?.Citizen.LastName, Is.EqualTo(mockCaseResponse.Citizen.LastName));
            Assert.That(response?.AssignedStaff.FirstName, Is.EqualTo(mockCaseResponse.AssignedStaff.FirstName));
            Assert.That(response?.AssignedStaff.LastName, Is.EqualTo(mockCaseResponse.AssignedStaff.LastName));
            Assert.That(response?.Appointment.Type, Is.EqualTo(mockCaseResponse.Appointment.Type));
            Assert.That(response?.Appointment.Time, Is.EqualTo(mockCaseResponse.Appointment.Time));
            Assert.That(response?.Status, Is.EqualTo(mockCaseResponse.Status));
            Assert.That(response?.CheckedIn, Is.EqualTo(mockCaseResponse.CheckedIn));
            Assert.That(response?.Flagged, Is.EqualTo(mockCaseResponse.Flagged));
        });
    }
}