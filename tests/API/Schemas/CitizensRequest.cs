using Newtonsoft.Json;

namespace API.Schemas;

public class CitizensRequest
{
    [JsonProperty(Required = Required.Always)]
    public required string FirstName { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string LastName { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Email { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Password { get; set; }
}