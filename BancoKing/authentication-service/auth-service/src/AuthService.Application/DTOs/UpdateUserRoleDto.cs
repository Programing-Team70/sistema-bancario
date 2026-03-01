using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class UpdateUserRoleDto
{
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public string RoleName { get; set; } = string.Empty;
}
