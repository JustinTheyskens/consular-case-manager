namespace API.Cases;

using static RestAssured.Dsl;
using API.Availabilities;
using System.Net;
using API.Schemas;

public class NonEmptyCaseTest : NonEmptyAvailabilityTest
{
    protected string _citizenId = EMPTY_ID;
    protected long _caseRef = 0L;

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

    [SetUp]
    public void SetupCases()
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