namespace API.Availabilities;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class GetAvailabilitiesByStaffEmpty : BaseTest
{
    public GetAvailabilitiesByStaffEmpty() : base("/availabilities") { }

    [Test]
    [Description("Tests the GET /availabilities?staff route returns a status code 200")]
    public void GetAvailabilitiesReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
            .QueryParam("staff", EMPTY_ID)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the GET /availabilities?staff route returns an application/json")]
    public void GetAvailabilitiesReturnsJson()
    {
        Given()
            .Spec(_requestSpecification)
            .QueryParam("staff", EMPTY_ID)
        .When()
            .Get("/")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"));
    }

    [Test]
    [Description("Tests the GET /availabilities?staff returns an empty array")]
    public void GetAvailabilitiesReturnsArray()
    {
        Given()
            .Spec(_requestSpecification)
            .QueryParam("staff", EMPTY_ID)
        .When()
            .Get("/")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .And()
            .Body("$", NHamcrest.Is.OfLength(0));
    }
}

[TestFixture]
public class GetAvailabilitiesByStaffNonEmpty : NonEmptyAvailabilityTest
{
    [Test]
    [Description("Tests that GET /availabilities?staff returns a length 1 array")]
    public void GetStaffReturnsArrayOfLengthOne()
    {
        var response = Given()
            .Spec(_requestSpecification)
            .QueryParam("staff", _staffId)
        .When()
            .Get("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AvailabilityResponse[]>();

        Assert.That(response, Has.Length.EqualTo(1));
    }

    [Test]
    [Description("Tests that GET /availabilities?staff returns an array with first element of the added element")]
    public void GetStaffReturnsArrayWithOneStaff()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .QueryParam("staff", _staffId)
        .When()
            .Get("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AvailabilityResponse[]>();

        var actual = response?[0];

        Assert.Multiple(() =>
        {
            Assert.That(actual?._id, Is.EqualTo(_availabilityId));
            Assert.That(actual?.StartTime, Is.EqualTo(mockAvailabilityResponse.StartTime));
            Assert.That(actual?.EndTime, Is.EqualTo(mockAvailabilityResponse.EndTime));
            Assert.That(actual?.DayOfWeek, Is.EqualTo(mockAvailabilityResponse.DayOfWeek));
            Assert.That(actual?.AllowedAppointments, Is.EqualTo(mockAvailabilityResponse.AllowedAppointments));
            Assert.That(actual?.Capacity, Is.EqualTo(mockAvailabilityResponse.Capacity));
            Assert.That(actual?.Staff, Is.EqualTo(mockAvailabilityResponse.Staff));
        });
    }
}