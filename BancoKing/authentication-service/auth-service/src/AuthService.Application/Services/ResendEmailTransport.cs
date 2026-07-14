using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class ResendEmailTransport(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<ResendEmailTransport> logger) : IEmailTransport
{
    public async Task SendHtmlEmailAsync(
        string to,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default)
    {
        var apiKey = configuration["Resend:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("Resend:ApiKey no está configurada.");
        }

        var from = configuration["Resend:FromEmail"] ?? "Banco King <onboarding@resend.dev>";

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey.Trim());
        request.Content = JsonContent.Create(new ResendEmailRequest
        {
            From = from,
            To = [to],
            Subject = subject,
            Html = htmlBody
        });

        var response = await httpClient.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            logger.LogInformation("Email enviado vía Resend a {Email}", to);
            return;
        }

        var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
        logger.LogError("Resend falló ({StatusCode}): {Body}", (int)response.StatusCode, errorBody);
        throw new InvalidOperationException($"Resend no pudo enviar el correo: {errorBody}");
    }

    private sealed class ResendEmailRequest
    {
        [JsonPropertyName("from")]
        public string From { get; set; } = string.Empty;

        [JsonPropertyName("to")]
        public string[] To { get; set; } = [];

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;
    }
}
