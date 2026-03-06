namespace API.Cases;

using System.Net;
using API.Base;
using API.Schemas;
using static RestAssured.Dsl;

[TestFixture]
public class DeleteCasesEmpty : BaseTest
{
    public DeleteCasesEmpty() : base("/cases") { }

    [Test]
    [Description("Tests the DELETE /cases/:ref route returns a status code 204")]
    public void DeleteCasesReturnsNoContent()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/0")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);
    }

    [Test]
    [Description("Tests DELETE /cases/:ref route with an invalid case ID returns a status code 500")]
    public void DeleteInvalidCasesIdReturnsInternalServerError()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete("/abc")
        .Then()
            .StatusCode(HttpStatusCode.InternalServerError);
    }

    [Test]
    [Description("Tests the DELETE /cases/:ref route returns an empty body")]
    public void DeleteCasesReturnsEmptyBody()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/0")
        .Then()
            .Body(NHamcrest.Is.EqualTo(""));
    }
}

[TestFixture]
public class DeleteCasesNonEmpty : NonEmptyCaseTest
{
    [Test]
    [Description("Tests that after a DELETE /cases/:ref the cases with given ref cannot be found")]
    public void DeleteCasesRemovesCasesWithGivenId()
    {
        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        Given()
            .Spec(_requestSpecification)
        .When()
            .Get($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.NotFound);
    }
    [Test]
    [Description("Tests that after a DELETE /cases/:ref also removes the associated appointment")]
    public void DeleteCasesRemovesAssociatedAppointment()
    {
        var response =
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/appointments")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AppointmentResponse[]>();
        
        Assert.That(response, Has.Length.EqualTo(1));

        Given()
            .Spec(_requestSpecification)
        .When()
            .Delete($"/cases/{_caseRef}")
        .Then()
            .StatusCode(HttpStatusCode.NoContent);

        response =
        Given()
            .Spec(_requestSpecification)
        .When()
            .Get("/appointments")
        .Then()
            .StatusCode(HttpStatusCode.OK)
            .DeserializeTo<AppointmentResponse[]>();
        
        Assert.That(response, Has.Length.EqualTo(0));
    }
}