using Newtonsoft.Json;

namespace API.Schemas;

public class LoginRequest
{
    [JsonProperty(Required = Required.Always)]
    public required string Email { get; set; }

    [JsonProperty(Required = Required.Always)]
    public required string Password { get; set; }
}