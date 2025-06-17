using Api.Dto.ClientesDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteJuridicoController : ControllerBase
    {
        private readonly IClienteJuridicoService _clienteJuridico;

        public ClienteJuridicoController(IClienteJuridicoService clienteJuridico)
        {
            _clienteJuridico = clienteJuridico;
        }

        [HttpGet("ObtenerClienteJuridicoes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerClienteJuridicoes(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _clienteJuridico.ObtenerClientesJuridicos(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }

        [HttpPost("CrearClienteJuridico")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearClienteJuridico([FromBody] CrearClienteJuridicoDto CrearClienteJuridico)
        {
            var RespuestaClienteJuridico = await _clienteJuridico.CrearClienteJuridico(CrearClienteJuridico);
            if (RespuestaClienteJuridico.Failed)
            {
                if (RespuestaClienteJuridico.status == Status.Conflict)
                    return StatusCode(409, RespuestaClienteJuridico.Error);

                if (RespuestaClienteJuridico.status == Status.None)
                    return StatusCode(500, RespuestaClienteJuridico.Error);
            }

            return Ok(RespuestaClienteJuridico.Value);
        }

        [HttpPut("BajaClienteJuridico")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaClienteJuridico(string id)
        {
            var RespuestaClienteJuridico = await _clienteJuridico.BajaClienteJuridico(id);

            if (RespuestaClienteJuridico.Failed)
            {
                if (RespuestaClienteJuridico.status == Status.NotFound)
                    return NotFound(RespuestaClienteJuridico.Error);

                if (RespuestaClienteJuridico.status == Status.WithoutChanges)
                    return StatusCode(304, RespuestaClienteJuridico.Error);
            }

            return NoContent();
        }

        [HttpPut("ActualizarClienteJuridico")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarClienteJuridicoes([FromBody] ClienteJuridicoDto ActualizarProducto)
        {
            var RespuestaClienteJuridico = await _clienteJuridico.ActualizarClienteJuridico(ActualizarProducto);

            if (RespuestaClienteJuridico.Failed)
            {
                if (RespuestaClienteJuridico.status == Status.Conflict)
                    return StatusCode(409, RespuestaClienteJuridico.Error);

                if (RespuestaClienteJuridico.status == Status.None)
                    return StatusCode(500, RespuestaClienteJuridico.Error);

            }

            return Ok(RespuestaClienteJuridico.Value);
        }

    }
}
