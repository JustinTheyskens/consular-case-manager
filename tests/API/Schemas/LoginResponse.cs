using Newtonsoft.Json;

namespace API.Schemas;

public class LoginResponse
{
    [JsonProperty(Required = Required.Always)]
    public required int UserId { get; set; }
}