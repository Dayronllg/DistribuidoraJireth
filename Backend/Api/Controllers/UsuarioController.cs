using Api.Dto.UsuariosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Security;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly Utilidad _utilidad;

        public UsuarioController(IUserService userService, IMapper mapper, Utilidad utilidad)
        {
            _userService = userService;
            _mapper = mapper;
            _utilidad = utilidad;
        }

        [HttpPost("Crear")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
         [ProducesResponseType(StatusCodes.Status201Created)]

        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioCreateDto Udto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var UsuarioNuevo = _mapper.Map<Usuario>(Udto);

            var result = await _userService.create(UsuarioNuevo);
            if (!result.Success)
                return BadRequest(result.Error);

            return Created();

        }
    }
}
