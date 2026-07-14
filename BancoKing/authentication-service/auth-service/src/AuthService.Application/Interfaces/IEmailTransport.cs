namespace AuthService.Application.Interfaces;

public interface IEmailTransport
{
    Task SendHtmlEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}
