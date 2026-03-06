using Newtonsoft.Json;

namespace API.Schemas;

public class AppointmentRequest
{
    [JsonProperty(Required = Required.Always)]
    public required string Type { get; set; }
    
    [JsonProperty(Required = Required.Always)]
    public required string Time { get; set; }

}