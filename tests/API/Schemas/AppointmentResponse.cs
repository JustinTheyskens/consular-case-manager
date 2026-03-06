using Newtonsoft.Json;

namespace API.Schemas;

public class AppointmentResponse
{
    [JsonProperty(Required = Required.Always)]
    public required string Type { get; set; }
    
    [JsonProperty(Required = Required.Always)]
    public required string Time { get; set; }

    public string? _id { get; set; }
}