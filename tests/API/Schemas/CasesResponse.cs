using Newtonsoft.Json;

namespace API.Schemas;

public class CasesResponse
{
    [JsonProperty(Required = Required.Always)]
    public required long Reference { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Status { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required AppointmentResponse Appointment { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required StaffResponse AssignedStaff { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required CitizensResponse Citizen { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required bool CheckedIn { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required bool Flagged { get; set; }

    public string? _id { get; set; }
}