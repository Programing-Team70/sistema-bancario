using System;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/vl/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        var response = new
        {
            status = "Healthy",
            timestap = DateTime.UtcNow.ToString("yyyy-MM--ddTHH:mm:ss.fffz"),
            service = "Kinal Sports AuthService"

        };
        return Ok(response);
    }
}