using Api.Dto.RolesDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolService _rolService;

        public RolController(IRolService rolService)
        {
            _rolService = rolService;
        }

        [HttpPost("CrearRol")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CrearTrabajador([FromBody] RolDto crear)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var RespuestaRol = await _rolService.CrearRol(crear);

            if (RespuestaRol.Failed)
                return Conflict(RespuestaRol.Error);

            return Ok(RespuestaRol.Value);
        }

        [HttpGet("ObtenerRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(int pagina, int tamanioPagina)
        {
            var RoleResult = await _rolService.PaginarRol(pagina, tamanioPagina);

            return Ok(RoleResult);
        }

        [HttpPut("BajaRol")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
         [ProducesResponseType(StatusCodes.Status304NotModified)]
        public async Task<IActionResult> Baja(int id)
        {
            var result = await _rolService.BajaRol(id);
            if (result.Failed)
            {
                return result.status switch
                {
                    Status.NotFound => NotFound(result.Error),
                    Status.WithoutChanges => StatusCode(304, result.Error)
                };
            }

            return Ok();

        } 
    }
}
