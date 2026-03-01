using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthService.Application.Interfaces;
using AuthService.Application.DTOs;
using AuthService.Domain.Constants;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UserController(IUserManagementService userService) : ControllerBase
{
    // Obtener todos los usuarios (Solo para el Administrador)
    [HttpGet]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE)]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
    {
        var result = await userService.GetAllUsersAsync();
        return Ok(result);
    }

    // Obtener un usuario específico por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponseDto>> GetById(string id)
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole(RoleConstants.ADMIN_ROLE);

        // Si no es admin y está intentando ver un ID que no es el suyo -> Prohibido
        if (!isAdmin && currentUserId != id)
        {
            return Forbid();
        }

        var result = await userService.GetUserDetailsAsync(id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponseDto>> Update(string id, [FromBody] UpdateUserDto updateDto)
    {
        // Obtener ID del usuario que está logueado
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole(RoleConstants.ADMIN_ROLE);

        // Si no es Admin y el ID no es el suyo, rechazar
        if (!isAdmin && currentUserId != id)
        {
            return Forbid("No tienes permiso para editar este perfil.");
        }

        // El servicio se encarga de que un Admin no edite a otro Admin
        var result = await userService.UpdateUserAsync(id, updateDto);
        return Ok(result);
    }

    // Eliminar un usuario (Solo para el Administrador)
    [HttpDelete("{id}")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE)]
    public async Task<IActionResult> Delete(string id)
    {
        // El service ya valida que un Admin no elimine a otro Admin
        await userService.DeleteUserAsync(id);
        return NoContent();
    }

    // Cambiar el Rol de un usuario (Admin Only)
    [HttpPost("assign-role")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE)]
    public async Task<ActionResult<UserResponseDto>> UpdateRole([FromBody] UpdateUserRoleDto roleDto)
    {
        var result = await userService.UpdateUserRoleAsync(roleDto.UserId, roleDto.RoleName);
        return Ok(result);
    }

    // Obtener el perfil del usuario logueado (Cualquier usuario autenticado)
    [HttpGet("me")]
    public async Task<ActionResult<UserResponseDto>> GetMyProfile()
    {
        // Extraemos el ID del usuario desde los Claims del Token JWT
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("No se pudo identificar al usuario a través del token.");
        }

        var result = await userService.GetUserDetailsAsync(userId);

        // Si NO es ADMIN, ocultamos campos sensibles
        if (!User.IsInRole(RoleConstants.ADMIN_ROLE))
        {
            result.Id = null;
            result.Role = null;
            result.Status = null;
            result.IsEmailVerified = null;
            result.CreatedAt = null;
            result.UpdatedAt = null;
        }

        // Si es ADMIN, ocultamos campos sensibles
        if (User.IsInRole(RoleConstants.ADMIN_ROLE))
        {
            result.Id = null;
            result.IsEmailVerified = null;
            result.CreatedAt = null;
            result.UpdatedAt = null;
        }
        return Ok(result);
    }
}
