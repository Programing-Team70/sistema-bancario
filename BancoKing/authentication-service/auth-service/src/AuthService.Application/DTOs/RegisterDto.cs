using System.ComponentModel.DataAnnotations;
using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    // Campos bancarios faltantes
    [Required]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "El DPI debe tener 13 dígitos")]
    public string DPI { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string JobName { get; set; } = string.Empty;

    [Required]
    [Range(100.01, double.MaxValue, ErrorMessage = "Los ingresos deben ser mayores a Q100")]
    public decimal MonthlyIncome { get; set; }

    [Required]
    [StringLength(8, MinimumLength = 8)]
    public string Phone { get; set; } = string.Empty;
}
