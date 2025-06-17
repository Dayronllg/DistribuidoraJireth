using Api.Dto.ClientesDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteNaturalController : ControllerBase
    {
        private readonly IClienteNatural _clienteNatural;

        public ClienteNaturalController(IClienteNatural clienteNatural)
        {
            _clienteNatural = clienteNatural;
        }

        [HttpGet("ObtenerClienteNaturales")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerClienteNaturales(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _clienteNatural.ObtenerClientesNaturales(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }

        [HttpPost("CrearClienteNatural")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearClienteNatural([FromBody] CrearClienteNaturalDto CrearClienteNatural)
        {
            var RespuestaClienteNatural = await _clienteNatural.CrearClientNatural(CrearClienteNatural);
            if (RespuestaClienteNatural.Failed)
            {
                if (RespuestaClienteNatural.status == Status.Conflict)
                    return StatusCode(409, RespuestaClienteNatural.Error);

                if (RespuestaClienteNatural.status == Status.None)
                    return StatusCode(500, RespuestaClienteNatural.Error);
            }

            return Ok(RespuestaClienteNatural.Value);
        }

        [HttpPut("BajaClienteNatural")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaClienteNatural(int id)
        {
            var RespuestaClienteNatural = await _clienteNatural.BajaClienteNatural(id);

            if (RespuestaClienteNatural.Failed)
            {
                if (RespuestaClienteNatural.status == Status.NotFound)
                    return NotFound(RespuestaClienteNatural.Error);

                if (RespuestaClienteNatural.status == Status.WithoutChanges)
                    return StatusCode(304, RespuestaClienteNatural.Error);
            }

            return NoContent();
        }

        [HttpPut("ActualizarClienteNatural")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarClienteNaturales([FromBody] ClienteNaturalDto ActualizarProducto)
        {
            var RespuestaClienteNatural = await _clienteNatural.ActualizarClienteNatural(ActualizarProducto);

            if (RespuestaClienteNatural.Failed)
            {
                if (RespuestaClienteNatural.status == Status.Conflict)
                    return StatusCode(409, RespuestaClienteNatural.Error);

                if (RespuestaClienteNatural.status == Status.None)
                    return StatusCode(500, RespuestaClienteNatural.Error);

            }

            return Ok(RespuestaClienteNatural.Value);
        }

    }
}
