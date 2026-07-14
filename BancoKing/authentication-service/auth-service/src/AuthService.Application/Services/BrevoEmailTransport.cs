using System.Net.Http.Json;
using System.Text.Json.Serialization;
using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class BrevoEmailTransport(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<BrevoEmailTransport> logger) : IEmailTransport
{
    public async Task SendHtmlEmailAsync(
        string to,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default)
    {
        var apiKey = configuration["Brevo:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("Brevo:ApiKey no está configurada.");
        }

        var fromEmail = configuration["Brevo:FromEmail"] ?? configuration["SmtpSettings:FromEmail"];
        var fromName = configuration["Brevo:FromName"] ?? configuration["SmtpSettings:FromName"] ?? "Banco King";

        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("Brevo:FromEmail no está configurada.");
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey.Trim());
        request.Content = JsonContent.Create(new BrevoEmailRequest
        {
            Sender = new BrevoSender { Name = fromName, Email = fromEmail },
            To = [new BrevoRecipient { Email = to }],
            Subject = subject,
            HtmlContent = htmlBody
        });

        var response = await httpClient.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            logger.LogInformation("Email enviado vía Brevo a {Email}", to);
            return;
        }

        var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
        logger.LogError("Brevo falló ({StatusCode}): {Body}", (int)response.StatusCode, errorBody);
        throw new InvalidOperationException($"Brevo no pudo enviar el correo: {errorBody}");
    }

    private sealed class BrevoEmailRequest
    {
        [JsonPropertyName("sender")]
        public BrevoSender Sender { get; set; } = new();

        [JsonPropertyName("to")]
        public BrevoRecipient[] To { get; set; } = [];

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("htmlContent")]
        public string HtmlContent { get; set; } = string.Empty;
    }

    private sealed class BrevoSender
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }

    private sealed class BrevoRecipient
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }
}
