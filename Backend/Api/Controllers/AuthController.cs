using Api.Dto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Api.Controllers
{
    [EnableCors("Mypolicy")]
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly Utilidad _utilidad;

        public AuthController(IUserService userService, Utilidad utilidad)
        {
            _userService = userService;
            _utilidad = utilidad;
        }

        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<IActionResult> login([FromBody] UsuarioLogDto u)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            
            var usuario = await _userService.Login(u);

            if (usuario.Failed)
            {
                return Unauthorized(usuario.Error);
            }

            return Ok(_utilidad.GenerarToken(usuario.Value));

        }
    }
}
