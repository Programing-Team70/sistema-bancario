using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities;

public class UserProfile
{
    [Key]
    [MaxLength(16)]
    public string Id { get; set; } = string.Empty;

    [Required(ErrorMessage = "El ID del usuario es obligatorio")]
    [MaxLength(16)]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal MonthlyIncome { get; set; }

    [MaxLength(50)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(50)]
    public string JobName { get; set; } = string.Empty;

    [Required]
    [MaxLength(13)]
    public string DPI { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 8, ErrorMessage = "El número de teléfono debe ser exactamente de 8 caracteres")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "El número de telefono debe de contener solo números")]
    public string Phone { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}
