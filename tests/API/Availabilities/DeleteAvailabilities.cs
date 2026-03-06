namespace API.Availabilities;

using System.Net;
using API.Base;
using static RestAssured.Dsl;

[TestFixture]
public class DeleteAvailabilitiesEmpty : BaseTest
{
    public DeleteAvailabilitiesEmpty() : base("/availabilities") { }

    [Test]
    [Description("Tests the DELETE /availabilities/:id route returns a status code 204")]
    public void DeleteAvailabilitiesReturnsNoContent()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{EMPTY_ID}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [Test]
    [Description("Tests DELETE /availabilities/:id route with an invalid availabilities ID returns a status code 500")]
    public void DeleteInvalidAvailabilitiesIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the DELETE /availabilities/:id route returns an empty body")]
    public void DeleteAvailabilitiesReturnsEmptyBody()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/{EMPTY_ID}")
        .Then()
            .Body(NHamcrest.Is.EqualTo(""));
    }
}

[TestFixture]
public class DeleteAvailabilitiesNonEmpty : NonEmptyAvailabilityTest
{
    [Test]
    [Description("Tests that after a DELETE /availabilities/:id the availabilities with given id cannot be found")]
    public void DeleteAvailabilitiesRemovesAvailabilitiesWithGivenId()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/availabilities/{_availabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/availabilities/{_availabilityId}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }
}