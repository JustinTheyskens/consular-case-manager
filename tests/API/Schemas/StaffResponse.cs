using Newtonsoft.Json;

namespace API.Schemas;

public class StaffResponse
{
    [JsonProperty(Required = Required.Always)]
    public required string FirstName { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string LastName { get; set; }

    public string? _id { get; set; }
}