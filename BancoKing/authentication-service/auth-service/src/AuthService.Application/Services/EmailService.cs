using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class EmailService(
    IEmailTransport emailTransport,
    IConfiguration configuration,
    ILogger<EmailService> logger) : IEmailService
{
    public Task SendEmailVerificationAsync(string email, string username, string token)
    {
        var subject = "Verifica tu dirección de correo electrónico";
        var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}";

        var body = $@"
            <h2>¡Bienvenido {username} a BancoKing!</h2>
            <p>Por favor, verifica tu correo haciendo clic en el enlace:</p>
            <a href='{verificationUrl}' style='background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;'>
                Verificar correo
            </a>
            <p>Si no funciona el botón, copia esta URL:</p>
            <p>{verificationUrl}</p>
            <p>Este enlace expira en 24 horas.</p>
        ";

        return SendEmailAsync(email, subject, body);
    }

    public Task SendPasswordResetAsync(string email, string username, string token)
    {
        var subject = "Restablece tu contraseña";
        var resetUrl = $"{configuration["AppSettings:FrontendUrl"]}/reset-password?token={token}";

        var body = $@"
            <h2>Restablecimiento de contraseña</h2>
            <p>Hola {username},</p>
            <p>Haz clic para restablecer tu contraseña:</p>
            <a href='{resetUrl}' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;'>
                Restablecer contraseña
            </a>
            <p>{resetUrl}</p>
        ";

        return SendEmailAsync(email, subject, body);
    }

    public Task SendWelcomeEmailAsync(string email, string username)
    {
        var subject = "¡Bienvenido a BancoKing!";
        var body = $@"
            <h2>¡Bienvenido a BancoKing, {username}!</h2>
            <p>Tu cuenta ha sido verificada y activada exitosamente.</p>
            <p>Ya puedes iniciar sesión en la plataforma.</p>
        ";

        return SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            await emailTransport.SendHtmlEmailAsync(to, subject, body);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar email a {Email}", to);

            var useFallback = bool.Parse(configuration["SmtpSettings:UseFallback"] ?? "false");
            if (useFallback)
            {
                logger.LogWarning("UseFallback activo. Email omitido para {Email}", to);
                return;
            }

            throw;
        }
    }
}
