using AuthService.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace AuthService.Application.Services;

public class SmtpEmailTransport(IConfiguration configuration, ILogger<SmtpEmailTransport> logger)
    : IEmailTransport
{
    public async Task SendHtmlEmailAsync(
        string to,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        var enabled = bool.Parse(smtpSettings["Enabled"] ?? "true");
        if (!enabled)
        {
            logger.LogInformation("SMTP deshabilitado. Omitiendo envío a {Email}", to);
            return;
        }

        var host = smtpSettings["Host"];
        var portString = smtpSettings["Port"];
        var username = smtpSettings["Username"];
        var password = smtpSettings["Password"];
        var fromEmail = smtpSettings["FromEmail"];
        var fromName = smtpSettings["FromName"];

        if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
        {
            throw new InvalidOperationException("La configuración SMTP no está completa.");
        }

        var port = int.Parse(portString ?? "587");

        using var client = new SmtpClient
        {
            Timeout = int.Parse(smtpSettings["Timeout"] ?? "30000")
        };

        var ignoreCertErrors = bool.Parse(smtpSettings["IgnoreCertificateErrors"] ?? "false");
        if (ignoreCertErrors)
        {
            client.ServerCertificateValidationCallback = (_, _, _, _) => true;
        }

        var useImplicitSsl = bool.Parse(smtpSettings["UseImplicitSsl"] ?? "false");

        if (useImplicitSsl || port == 465)
        {
            await client.ConnectAsync(host, port, SecureSocketOptions.SslOnConnect, cancellationToken);
        }
        else if (port == 587)
        {
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls, cancellationToken);
        }
        else
        {
            await client.ConnectAsync(host, port, SecureSocketOptions.Auto, cancellationToken);
        }

        await client.AuthenticateAsync(username, password, cancellationToken);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        message.To.Add(new MailboxAddress("", to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        logger.LogInformation("Email enviado vía SMTP a {Email}", to);
    }
}
