using Api.Dto.VentasDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {

        private readonly IVentaService _ventaService;

        public VentasController(IVentaService ventaService)
        {
            _ventaService = ventaService;
        }

        [HttpPost("CrearVenta")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearVenta([FromBody] CrearVentaDto CrearVenta)
        {
            var RespuestaVenta = await _ventaService.CrearVenta(CrearVenta);
            if (RespuestaVenta.Failed)
            {
                if (RespuestaVenta.status == Status.Conflict)
                    return StatusCode(409, RespuestaVenta.Error);

                if (RespuestaVenta.status == Status.None)
                    return StatusCode(500, RespuestaVenta.Error);

                if (RespuestaVenta.status == Status.NotFound)
                    return NotFound(RespuestaVenta.Error);
            }

            return Ok(RespuestaVenta.Value);
        }
        
        
        [HttpGet("ObtenerVentas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerPedidos(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _ventaService.PaginarVenta(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }


    }
}
