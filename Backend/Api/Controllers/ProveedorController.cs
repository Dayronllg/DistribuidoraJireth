using Api.Dto.ProveedoresDto;
using Api.Dto.TrabajadorDtos;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IProvedorService _provedorService;

        public ProveedorController(IProvedorService provedorService)
        {
            _provedorService = provedorService;
        }

        [HttpGet("ObtenerProveedores")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerProveedores(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _provedorService.ObtenerProvedores(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }

        [HttpPost("CrearProveedor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearProveedor([FromBody] CrearProveedorDto CrearProveedor)
        {
            var RespuestaProveedor = await _provedorService.CrearProvedor(CrearProveedor);
            if (RespuestaProveedor.Failed)
            {
                if (RespuestaProveedor.status == Status.Conflict)
                    return StatusCode(409, RespuestaProveedor.Error);

                if (RespuestaProveedor.status == Status.None)
                    return StatusCode(500, RespuestaProveedor.Error);
            }

            return Ok(RespuestaProveedor.Value);
        }

        [HttpPut("BajaProveedor")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaProveedor(string ruc)
        {
            var RespuestaProveedor = await _provedorService.BajaProveedor(ruc);

            if (RespuestaProveedor.Failed)
            {
                if (RespuestaProveedor.status == Status.NotFound)
                    return NotFound(RespuestaProveedor.Error);

                if (RespuestaProveedor.status == Status.WithoutChanges)
                    return StatusCode(304, RespuestaProveedor.Error);
            }

            return NoContent();
        }

        [HttpPut("ActualizarProveedor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarProveedores([FromBody] ProveedorDto ActualizarProducto)
        {
            var RespuestaProveedor = await _provedorService.ActualizarProveedor(ActualizarProducto);

            if (RespuestaProveedor.Failed)
            {
                if (RespuestaProveedor.status == Status.Conflict)
                    return StatusCode(409, RespuestaProveedor.Error);

                if (RespuestaProveedor.status == Status.None)
                    return StatusCode(500, RespuestaProveedor.Error);

            }

            return Ok(RespuestaProveedor.Value);
        }

        
    }
}
