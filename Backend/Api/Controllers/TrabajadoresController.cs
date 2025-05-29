using Api.Dto.TrabajadorDtos;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrabajadoresController : ControllerBase
    {
        private readonly ITrabajador _trabajador;

        public TrabajadoresController(ITrabajador trabajador)
        {
            _trabajador = trabajador;
        }

        [HttpPost("CrearTrabajador")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CrearTrabajador([FromBody] CrearTrabajadorDto crear)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var RespuestaProducto = await _trabajador.CrearTrabajador(crear);

            if (RespuestaProducto.Failed)
                return Conflict(RespuestaProducto.Error);

            return Ok(RespuestaProducto.Value);
        }
    }
}
