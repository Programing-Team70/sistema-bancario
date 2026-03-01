using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IUserManagementService
{
    // Gestión de Roles
    Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName);
    Task<IReadOnlyList<string>> GetUserRolesAsync(string userId);

    // El administrador necesita ver a todos los clientes para gestionarlos
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();

    // El administrador puede ver los detalles de un usuario, incluyendo saldo (vía DTO)
    Task<UserResponseDto> GetUserDetailsAsync(string userId);

    // Editar cliente: El servicio validará ingresos > Q100 y que NO se cambie DPI o Password
    Task<UserResponseDto> UpdateUserAsync(string userId, UpdateUserDto updateDto);

    // Eliminar cliente: El servicio validará que NO sea otro administrador
    Task<bool> DeleteUserAsync(string userId);
    
    // Para la función de "ver usuarios por rol"
    Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName);
}
