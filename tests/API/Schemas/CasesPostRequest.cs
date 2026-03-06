using Newtonsoft.Json;

namespace API.Schemas;

public class CasesPostRequest
{
    [JsonProperty(Required = Required.Always)]
    public required string Citizen { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required AppointmentRequest Appointment { get; set; }
}