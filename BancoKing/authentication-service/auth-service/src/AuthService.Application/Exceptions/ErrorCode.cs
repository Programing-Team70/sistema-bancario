using System;

namespace AuthService.Application.Exceptions;

public class ErrorCodes
{
    // Autenticación y Registro Existente
    public const string EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public const string USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS";
    public const string INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public const string USER_ACCOUNT_DISABLED = "USER_ACCOUNT_DISABLED";
    public const string USER_NOT_FOUND = "USER_NOT_FOUND";

    // Reglas de Negocio del Banco (Administrador)
    public const string INSUFFICIENT_MONTHLY_INCOME = "INSUFFICIENT_MONTHLY_INCOME"; // < Q100
    public const string ADMIN_CANNOT_MANAGE_ADMIN = "ADMIN_CANNOT_MANAGE_ADMIN"; // No editar otros admin
    public const string IMMUTABLE_FIELD_UPDATE = "IMMUTABLE_FIELD_UPDATE"; // No editar DPI o Password

    // Permisos y Seguridad
    public const string UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS";
    public const string FORBIDDEN_ACTION = "FORBIDDEN_ACTION";

}
