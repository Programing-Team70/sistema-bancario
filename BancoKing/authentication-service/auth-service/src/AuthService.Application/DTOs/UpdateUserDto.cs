using System;

namespace AuthService.Application.DTOs;

public class UpdateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string JobName { get; set; } = string.Empty;
    public decimal MonthlyIncome { get; set; }
    public string Phone { get; set; } = string.Empty;
}
