namespace API.Cases;

using static RestAssured.Dsl;
using API.Availabilities;
using System.Net;
using API.Schemas;

[TestFixture]
public class PostCasesEmpty : NonEmptyAvailabilityTest
{
    protected string _citizenId = EMPTY_ID;
    protected long _caseRef = 0L;
    protected long _secondCaseRef = 0L;

    protected readonly static AppointmentRequest mockAppointmentRequest = new()
    {
        Type = "passport-renewal",
        Time = "1970-01-04T00:00:00.000Z"
    };

    protected readonly static CitizensRequest mockCitizenRequest = new()
    {
        Email = "jake.doe@example.com",
        Password = "Test3",
        FirstName = "Jake",
        LastName = "Doe"
    };

    protected readonly static CasesPostRequest mockCaseRequest = new()
    {
        Citizen = EMPTY_ID,
        Appointment = mockAppointmentRequest
    };

    protected readonly static CasesResponse mockCaseResponse = new()
    {
        Reference = 0,
        Status = "scheduled",
        Appointment = new()
        {
            Type = mockAppointmentRequest.Type,
            Time = mockAppointmentRequest.Time
        },
        AssignedStaff = new()
        {
            FirstName = mockStaffRequest.FirstName,
            LastName = mockStaffRequest.LastName
        },
        Citizen = new()
        {
            FirstName = mockCitizenRequest.FirstName,
            LastName = mockCitizenRequest.LastName
        },
        CheckedIn = false,
        Flagged = false
    };

    [OneTimeSetUp]
    public void SetupCitizens()
    {
        var id =
        Given()
            .Spec(_requestSpecification)
            .Body(mockCitizenRequest)
        .When()
            .Post("/citizens")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$._id");

        _citizenId = (string)id;
        mockCaseRequest.Citizen = _citizenId;
    }

    [Test]
    [Description("Tests the POST /cases route returns a status code 201")]
    public void PostCasesReturnsCreated()
    {
        var reference =
        Given()
            .Spec(_requestSpecification)
            .Body(mockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$.reference");

        _caseRef = (long)reference;
    }

    [Test]
    [Description("Tests the POST /cases route returns a new case document with correct fields")]
    public void PostCasesReturnsCorrectCaseDocument()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
            .Body(mockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .DeserializeTo<CasesResponse>();

        _caseRef = (long)response?.Reference!;

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

    [Test]
    [Description("Tests the POST /cases route creates an associated appointment document")]
    public void PostCitizensCreatesAppointmentDocument()
    {
        var reference =
        Given()
            .Spec(_requestSpecification)
            .Body(mockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.Created)
            .Extract().Body("$.reference");

        _caseRef = (long)reference;

        var response =
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/appointments")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AppointmentResponse[]>()?
            .First();

        Assert.That(response, Is.Not.Null);
    }

    [Test]
    [Description("Tests the POST /cases route with an invalid appointment type returns a status code 400")]
    public void PostCasesInvalidTypeReturnsBadRequest()
    {
        AppointmentRequest secondMockAppointmentRequest = new()
        {
            Type = "passport-retrieval",
            Time = "1970-01-04T00:00:00.000Z"
        };

        CasesPostRequest secondMockCaseRequest = new()
        {
            Citizen = _citizenId,
            Appointment = secondMockAppointmentRequest
        };

        Given()
            .Spec(_requestSpecification)
            .Body(secondMockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);
    }

       [Test]
    [Description("Tests the POST /cases route with an unavailable appointment type returns a status code 400")]
    public void PostCasesUnavailableTypeReturnsBadRequest()
    {
        AppointmentRequest secondMockAppointmentRequest = new()
        {
            Type = "passport-lost",
            Time = "1970-01-04T00:00:00.000Z"
        };

        CasesPostRequest secondMockCaseRequest = new()
        {
            Citizen = _citizenId,
            Appointment = secondMockAppointmentRequest
        };

        Given()
            .Spec(_requestSpecification)
            .Body(secondMockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);
    }

    [TearDown]
    public void TeardownSecondCase()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/cases/{_secondCaseRef}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [TearDown]
    public void TeardownCases()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [OneTimeTearDown]
    public void TeardownCitizens()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/citizens/{_citizenId}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }
}

public class PostCasesNonEmpty : NonEmptyCaseTest
{
    [Test]
    [Description("Tests the POST /cases route with an appointment time with no capacity returns a status code 400")]
    public void PostCasesNoCapacityReturnsBadRequest()
    {
        AppointmentRequest secondMockAppointmentRequest = new()
        {
            Type = "passport-renewal",
            Time = "1970-01-04T10:00:00.000Z"
        };

        CasesPostRequest secondMockCaseRequest = new()
        {
            Citizen = _citizenId,
            Appointment = secondMockAppointmentRequest
        };

        Given()
            .Spec(_requestSpecification)
            .Body(secondMockCaseRequest)
        .When()
            .Post("/cases")
        .Then()
            .StatusCode(HttpStatusCode.BadRequest);
    }
}