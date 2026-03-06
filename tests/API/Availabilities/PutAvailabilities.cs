namespace API.Availabilities;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PutAvailabilitiesByStaffEmpty : BaseTest
{

    private static readonly AvailabilityRequest mockAvailabilityRequest = new()
    {
        StartTime = 0,
        EndTime = 1439,
        DayOfWeek = 0,
        AllowedAppointments =
        [
            "passport-renewal",
            "passport-first",
            "passport-emergency",
            "passport-lost"
        ],
        Capacity = 1,
        Staff = EMPTY_ID
    };
    public PutAvailabilitiesByStaffEmpty() : base("/availabilities") { }

    [Test]
    [Description("Tests the PUT /availabilities/:id route with non-existant id returns a status code 404")]
    public void PostAvailabilitiesReturnsCreated()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityRequest)
        .When()
            .Put($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }

    [Test]
    [Description("Tests PUT /availabilities/:id route with an invalid availability ID returns a status code 500")]
    public void PutInvalidCitizensIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityRequest)
        .When()
            .Put("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }
}

[TestFixture]
public class PutAvailabilitiesByStaffNonEmpty : NonEmptyAvailabilityTest
{
    private readonly AvailabilityRequest mockAvailabilityPostRequest = new()
    {
        StartTime = 720,
        EndTime = 1199,
        DayOfWeek = 1,
        AllowedAppointments =
        [
            "passport-renewal",
        ],
        Capacity = 2,
        Staff = EMPTY_ID
    };

    private static readonly AvailabilityResponse mockAvailabilityPostResponse = new()
    {
        StartTime = 720,
        EndTime = 1199,
        DayOfWeek = 1,
        AllowedAppointments =
        [
            "passport-renewal",
        ],
        Capacity = 2,
        Staff = EMPTY_ID
    };

    [SetUp]
    public void SetStaffId()
    {
        mockAvailabilityPostRequest.Staff = _staffId;
        mockAvailabilityPostResponse.Staff = _staffId;    
    }

    [Test]
    [Description("Tests the PUT /availabilities/:id route returns status code 200")]
    public void PutCitizensReturnsOK()
    {
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityPostRequest)
        .When()
            .Put($"/availabilities/{_availabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.OK);
    }

    [Test]
    [Description("Tests the PUT /availabilities/:id route returns an updated availability object")]
    public void PutCitizensReturnsUpdatedAvailability()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityPostRequest)
        .When()
            .Put($"/availabilities/{_availabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AvailabilityResponse>();

        Assert.Multiple(() =>
        {
            Assert.That(response?._id, Is.EqualTo(_availabilityId));
            Assert.That(response?.StartTime, Is.EqualTo(mockAvailabilityPostResponse.StartTime));
            Assert.That(response?.EndTime, Is.EqualTo(mockAvailabilityPostResponse.EndTime));
            Assert.That(response?.DayOfWeek, Is.EqualTo(mockAvailabilityPostResponse.DayOfWeek));
            Assert.That(response?.AllowedAppointments, Is.EqualTo(mockAvailabilityPostResponse.AllowedAppointments));
            Assert.That(response?.Capacity, Is.EqualTo(mockAvailabilityPostResponse.Capacity));
            Assert.That(response?.Staff, Is.EqualTo(mockAvailabilityPostResponse.Staff));
        });
    }

    [Test]
    [Description("Tests the PUT /availabilities/:id route with overlapping availability returns status code 400")]
    public void PutCitizensReturnsBadRequest()
    {
        string _secondAvailabilityId = EMPTY_ID;
        try
        {
            AvailabilityRequest secondAvailabilityRequest = new()
            {
                StartTime = 0,
                EndTime = 1439,
                DayOfWeek = 1,
                AllowedAppointments =
                [
                    "passport-renewal",
                ],
                Capacity = 1,
                Staff = _staffId
            };

            var id =
            Given()
                .Spec(_requestSpecification)
                .Body(secondAvailabilityRequest)
            .When()
                .Post("/availabilities")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            _secondAvailabilityId = (string)id;

            Given()
                .Spec(_requestSpecification)
                .Body(mockAvailabilityPostRequest)
            .When()
                .Put($"/availabilities/{_availabilityId}")
            .Then()
                .StatusCode(HttpStatusCode.BadRequest);
        }
        finally
        {
            Given()
                .Spec(_requestSpecification)
            .When()
                .Delete($"/availabilities/{_secondAvailabilityId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
    }
}