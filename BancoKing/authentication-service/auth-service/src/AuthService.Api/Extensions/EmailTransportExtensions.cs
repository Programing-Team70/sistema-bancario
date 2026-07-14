using AuthService.Application.Interfaces;
using AuthService.Application.Services;

namespace AuthService.Api.Extensions;

public static class EmailTransportExtensions
{
    public static IServiceCollection AddEmailTransport(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient<ResendEmailTransport>();
        services.AddHttpClient<BrevoEmailTransport>();
        services.AddSingleton<SmtpEmailTransport>();
        services.AddScoped<IEmailTransport>(sp => ResolveEmailTransport(sp, sp.GetRequiredService<IConfiguration>()));
        return services;
    }

    private static IEmailTransport ResolveEmailTransport(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        var provider = configuration["Email:Provider"]?.Trim() ?? "Auto";

        if (provider.Equals("Brevo", StringComparison.OrdinalIgnoreCase))
        {
            return serviceProvider.GetRequiredService<BrevoEmailTransport>();
        }

        if (provider.Equals("Resend", StringComparison.OrdinalIgnoreCase))
        {
            return serviceProvider.GetRequiredService<ResendEmailTransport>();
        }

        if (provider.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
        {
            return serviceProvider.GetRequiredService<SmtpEmailTransport>();
        }

        if (!string.IsNullOrWhiteSpace(configuration["Brevo:ApiKey"]))
        {
            return serviceProvider.GetRequiredService<BrevoEmailTransport>();
        }

        if (!string.IsNullOrWhiteSpace(configuration["Resend:ApiKey"]))
        {
            return serviceProvider.GetRequiredService<ResendEmailTransport>();
        }

        return serviceProvider.GetRequiredService<SmtpEmailTransport>();
    }
}
