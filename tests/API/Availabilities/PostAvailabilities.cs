namespace API.Availabilities;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class PostAvailabilitiesByStaffEmpty : BaseTest
{
    private string _staffId = EMPTY_ID;
    private string _availabilityId = EMPTY_ID;
    private static readonly StaffRequest mockStaffRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

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

    private static readonly AvailabilityResponse mockAvailabilityResponse = new()
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

    public PostAvailabilitiesByStaffEmpty() : base("") { }

    [OneTimeSetUp]
    public void SetupStaff()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(mockStaffRequest)
        .When()
            .Post("/staff")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _staffId = (string)id;
        mockAvailabilityRequest.Staff = _staffId;
        mockAvailabilityResponse.Staff = _staffId;
    }

    [Test]
    [Description("Tests the POST /availabilities route returns a status code 201")]
    public void PostAvailabilitiesReturnsCreated()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityRequest)
        .When()
            .Post("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _availabilityId = (string)id;
    }

    [Test]
    [Description("Tests the POST /availabilities route returns an application/json")]
    public void PostAvailabilitiesReturnsJson()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityRequest)
        .When()
            .Post("/availabilities")
        .Then()
            .ContentType(NHamcrest.Contains.String("application/json"))
            .Extract().Body("$._id");

        _availabilityId = (string)id;
    }

    [Test]
    [Description("Tests the POST /availabilities route with empty body returns status code 500")]
    public void PostEmptyAvailabilitiesReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Post("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the POST /availabilities returns the new document")]
    public void PostAvailabilitiesReturnsNewDocument()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(mockAvailabilityRequest)
        .When()
            .Post("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .DeserializeTo<AvailabilityResponse>();

        _availabilityId = response?._id!;
        mockAvailabilityResponse._id = _availabilityId;

        Assert.Multiple(() =>
        {
            Assert.That(response?._id, Is.EqualTo(mockAvailabilityResponse._id));
            Assert.That(response?.StartTime, Is.EqualTo(mockAvailabilityResponse.StartTime));
            Assert.That(response?.EndTime, Is.EqualTo(mockAvailabilityResponse.EndTime));
            Assert.That(response?.DayOfWeek, Is.EqualTo(mockAvailabilityResponse.DayOfWeek));
            Assert.That(response?.AllowedAppointments, Is.EqualTo(mockAvailabilityResponse.AllowedAppointments));
            Assert.That(response?.Capacity, Is.EqualTo(mockAvailabilityResponse.Capacity));
            Assert.That(response?.Staff, Is.EqualTo(mockAvailabilityResponse.Staff));
        });

    }

    [TearDown]
    public void TeardownAvailability()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/availabilities/{_availabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [OneTimeTearDown]
    public void TeardownStaff()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/staff/{_staffId}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}

[TestFixture]
public class PostAvailabilitiesByStaffNonEmpty : NonEmptyAvailabilityTest
{
    private string _secondAvailabilityId = EMPTY_ID;
    private string _secondStaffId = EMPTY_ID;

    [Test]
    [Description("Tests the POST /availabilities with the same staff but different day returns status code 201")]
    public void PostAvailabilitiesSameStaffDifferentDayReturnsCreated()
    {
        AvailabilityRequest mockSecondAvailabilityRequest = new()
        {
            StartTime = 0,
            EndTime = 1439,
            DayOfWeek = 1,
            AllowedAppointments =
            [
                "passport-renewal",
                "passport-first",
                "passport-emergency",
                "passport-lost"
            ],
            Capacity = 1,
            Staff = _staffId
        };

        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(mockSecondAvailabilityRequest)
        .When()
            .Post("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _secondAvailabilityId = (string)id;
    }

    [Test]
    [Description("Tests the POST /availabilities with different staff but same day returns status code 201")]
    public void PostAvailabilitiesDifferentStaffSameDayReturnsCreated()
    {
        try
        {
            StaffRequest mockSecondStaffRequest = new()
            {
                Email = "jane.doe@example.com",
                Password = "Test2",
                FirstName = "Jane",
                LastName = "Doe"
            };

            var staffId =
            Given()
                .Spec(_requestSpecification)
                .Body(mockSecondStaffRequest)
            .When()
                .Post("/staff")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            _secondStaffId = (string)staffId;

            AvailabilityRequest mockSecondAvailabilityRequest = new()
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
                Staff = _secondStaffId
            };

            var id = 
            Given()
                .Spec(_requestSpecification)
                .Body(mockSecondAvailabilityRequest)
            .When()
                .Post("/availabilities")
            .Then()
                .StatusCode(HttpStatusCode.Created)
                .Extract().Body("$._id");

            _secondAvailabilityId = (string)id;
        }
        finally
        {
            Given()
                .Spec(_requestSpecification)
            .When()
                .Delete($"/staff/{_secondStaffId}")
            .Then()
                .StatusCode(HttpStatusCode.NoContent);
        }
    }

    [Test]
    [Description("Tests the POST /availabilities with the same staff but same day returns status code 400")]
    public void PostAvailabilitiesSameStaffSameDayReturnsBadRequest()
    {
        AvailabilityRequest mockSecondAvailabilityRequest = new()
        {
            StartTime = 360,
            EndTime = 719,
            DayOfWeek = 0,
            AllowedAppointments =
            [
                "passport-renewal",
                "passport-first",
                "passport-emergency",
                "passport-lost"
            ],
            Capacity = 1,
            Staff = _staffId
        };

        Given()
            .Spec(_requestSpecification)
            .Body(mockSecondAvailabilityRequest)
        .When()
            .Post("/availabilities")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);
    }

    [TearDown]
    public void TeardownSecondAvailability()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/availabilities/{_secondAvailabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}