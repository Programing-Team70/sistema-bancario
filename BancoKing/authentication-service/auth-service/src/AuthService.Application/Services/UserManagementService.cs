using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Application.Exceptions;

namespace AuthService.Application.Services;

public class UserManagementService(IUserRepository users, IRoleRepository roles) : IUserManagementService
{

    // Gestion de Visualización
    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var allUsers = await users.GetAllAsync();
        return allUsers.Select(MapToResponse);
    }

    public async Task<UserResponseDto> GetUserDetailsAsync(string userId)
    {
        var user = await users.GetByIdAsync(userId);
        return MapToResponse(user);
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUsersByRoleAsync(roleName);
        return usersInRole.Select(MapToResponse).ToList();
    }

    // Gestion de Datos
    public async Task<UserResponseDto> UpdateUserAsync(string userId, UpdateUserDto updateDto)
    {
        var user = await users.GetByIdAsync(userId);
        if (user == null) throw new KeyNotFoundException("Usuario no encontrado");

        var isTargetAdmin = user.UserRoles.Any(ur => ur.Role.Name == RoleConstants.ADMIN_ROLE);

        if (isTargetAdmin)
        {
            throw new BusinessException(ErrorCodes.FORBIDDEN_ACTION, "No se permite editar a otro Administrador.");
        }

        // Validación de ingresos mínimos (Q100)
        if (updateDto.MonthlyIncome < 100)
            throw new BusinessException(ErrorCodes.INSUFFICIENT_MONTHLY_INCOME, "Los ingresos deben ser >= Q100");

        // No se permite editar DPI o Password (se ignoran del DTO o simplemente no se mapean)
        user.Name = updateDto.Name;
        user.SurName = updateDto.Surname;

        if (user.UserProfile != null)
        {
            if (!string.IsNullOrWhiteSpace(updateDto.Address))
                user.UserProfile.Address = updateDto.Address;

            if (!string.IsNullOrWhiteSpace(updateDto.Phone))
                user.UserProfile.Phone = updateDto.Phone;

            if (!string.IsNullOrWhiteSpace(updateDto.JobName))
                user.UserProfile.JobName = updateDto.JobName;
            user.UserProfile.MonthlyIncome = updateDto.MonthlyIncome;
        }

        user.UpdatedAt = DateTime.UtcNow;

        await users.UpdateUserAsync(user);
        return MapToResponse(user);
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await users.GetByIdAsync(userId);

        // El administrador no puede eliminar a otro administrador
        var isTargetAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isTargetAdmin)
            throw new BusinessException(ErrorCodes.ADMIN_CANNOT_MANAGE_ADMIN, "No se puede eliminar a otro administrador");

        return await users.DeleteUserAsync(userId);
    }

    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));

        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Use {RoleConstants.ADMIN_ROLE} or {RoleConstants.USER_ROLE}");

        var user = await users.GetByIdAsync(userId);

        // No dejar al sistema sin administradores
        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);

            if (adminCount <= 1)
            {
                throw new InvalidOperationException("Cannot remove the last administrator");
            }
        }

        var role = await roles.GetByNameAsync(roleName)
            ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateUserRoleAsync(userId, role.Id);

        user = await users.GetByIdAsync(userId);
        return MapToResponse(user);
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId)
    {
        var roleNames = await roles.GetUserRoleNameAsync(userId);
        return roleNames;
    }

    private UserResponseDto MapToResponse(User u)
    {
        return new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.SurName,
            Username = u.UserName,
            Email = u.Email,
            Role = u.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE,
            Status = u.Status,
            Phone = u.UserProfile?.Phone ?? string.Empty,
            DPI = u.UserProfile?.DPI ?? string.Empty,
            Address = u.UserProfile?.Address ?? string.Empty,
            JobName = u.UserProfile?.JobName ?? string.Empty,
            MonthlyIncome = u.UserProfile?.MonthlyIncome ?? 0m,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        };
    }
}
