using Newtonsoft.Json;

namespace API.Schemas;

public class CasesPutResponse
{
    [JsonProperty(Required = Required.Always)]
    public required long Reference { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Status { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required AppointmentRequest Appointment { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string AssignedStaff { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Citizen { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required bool CheckedIn { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required bool Flagged { get; set; }

    public string? _id { get; set; }
}