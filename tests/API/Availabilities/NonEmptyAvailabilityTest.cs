namespace API.Availabilities;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

public class NonEmptyAvailabilityTest : BaseTest
{
    protected string _staffId = EMPTY_ID;
    protected string _availabilityId = EMPTY_ID;
    protected static readonly StaffRequest mockStaffRequest = new()
    {
        Email = "john.doe@example.com",
        Password = "Test",
        FirstName = "John",
        LastName = "Doe"
    };

    protected static readonly AvailabilityRequest mockAvailabilityRequest = new()
    {
        StartTime = 0,
        EndTime = 1439,
        DayOfWeek = 0,
        AllowedAppointments =
            [
              "passport-renewal",
              "passport-first",
              "passport-emergency"
            ],
        Capacity = 1,
        Staff = EMPTY_ID
    };

    protected static readonly AvailabilityResponse mockAvailabilityResponse = new()
    {
        StartTime = 0,
        EndTime = 1439,
        DayOfWeek = 0,
        AllowedAppointments =
            [
              "passport-renewal",
              "passport-first",
              "passport-emergency"
            ],
        Capacity = 1,
        Staff = EMPTY_ID
    };

    public NonEmptyAvailabilityTest() : base("") { }

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

    [SetUp]
    public void SetupAvailability()
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