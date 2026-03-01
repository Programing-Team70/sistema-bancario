using System;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Extensions;

public static partial class LoggerExtensions
{
    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Information,
        Message = "User {Username} registered successfully")]
    public static partial void LogUserRegistered(this ILogger logger, string username);

    [LoggerMessage(
        EventId = 1002,
        Level = LogLevel.Information,
        Message = "User login succeeded")]
    public static partial void LogUserLoggedIn(this ILogger logger);

    [LoggerMessage(
        EventId = 1003,
        Level = LogLevel.Warning,
        Message = "Failed login attempt")]
    public static partial void LogFailedLoginAttempt(this ILogger logger);

    [LoggerMessage(
        EventId = 1004,
        Level = LogLevel.Warning,
        Message = "Registration rejected: email already exists")]
    public static partial void LogRegistrationWithExistingEmail(this ILogger logger);

    [LoggerMessage(
        EventId = 1005,
        Level = LogLevel.Warning,
        Message = "Registration rejected: username already exists")]
    public static partial void LogRegistrationWithExistingUsername(this ILogger logger);

    // Auditoría de creación por Administrador (Crucial para el banco)
    [LoggerMessage(
        EventId = 1007,
        Level = LogLevel.Information,
        Message = "Admin created a new client: {Username}")]
    public static partial void LogClientCreatedByAdmin(this ILogger logger, string username);

    // Rechazo (Ingresos < Q100)
    [LoggerMessage(
        EventId = 1008,
        Level = LogLevel.Warning,
        Message = "Registration rejected: Income {Income} is below minimum requirement")]
    public static partial void LogRegistrationRejectedLowIncome(this ILogger logger, decimal income);

    // Intento de modificar datos prohibidos (DPI o Password por Admin)
    [LoggerMessage(
        EventId = 1009,
        Level = LogLevel.Warning,
        Message = "Restricted field update attempt on user {UserId}")]
    public static partial void LogRestrictedFieldUpdateAttempt(this ILogger logger, string userId);

    // Gestión de Roles
    [LoggerMessage(
        EventId = 1010,
        Level = LogLevel.Information,
        Message = "Role updated for user {UserId}. New Role ID: {RoleId}")]
    public static partial void LogUserRoleUpdated(this ILogger logger, string userId, string roleId);

    // Eliminación de usuarios (Acción crítica)
    [LoggerMessage(
        EventId = 1011,
        Level = LogLevel.Critical,
        Message = "User {UserId} was DELETED from the system")]
    public static partial void LogUserDeleted(this ILogger logger, string userId);
}
