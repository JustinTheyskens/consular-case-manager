using Newtonsoft.Json;

namespace API.Schemas;

public class AvailabilityRequest
{
    [JsonProperty(Required = Required.Always)]
    public required int StartTime { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required int EndTime { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required int DayOfWeek { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string[] AllowedAppointments { get; set; }
    
    [JsonProperty(Required = Required.Always)]
    public required int Capacity { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Staff { get; set; }

}