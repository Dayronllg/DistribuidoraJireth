using Api.Dto.ComprasDtos;
using Api.Repositery.IRepositery;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly ICompraService _compraService;
        private readonly IDetalleCompraService _detalleCompraService;

        public ComprasController(ICompraService compraService, IDetalleCompraService detalleCompraService)
        {
            _compraService = compraService;
            _detalleCompraService = detalleCompraService;
        }

        [HttpGet("ObtenerCompras")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerCompras(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _compraService.PaginarCompra(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }

        [HttpGet("ObtenerDetalleCompra")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PagDetallePedidoCompra(int id)
        {
            var respuestPagDetallePedidoCompra = await _detalleCompraService.PaginarDetalleCompra(id);

            return Ok(respuestPagDetallePedidoCompra);
        }

        [HttpPost("CrearCompra")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearCompra([FromBody] CrearCompraDto CrearCompra)
        {
            var RespuestaCompra = await _compraService.CrearCompra(CrearCompra);
            if (RespuestaCompra.Failed)
            {
                if (RespuestaCompra.status == Status.Conflict)
                    return StatusCode(409, RespuestaCompra.Error);

                if (RespuestaCompra.status == Status.None)
                    return StatusCode(500, RespuestaCompra.Error);

                if (RespuestaCompra.status == Status.NotFound)
                    return NotFound(RespuestaCompra.Error);
            }

            return Ok(RespuestaCompra.Value);
        }
        

         [HttpPut("BajaCompra")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaPedido(int id)
        {
            var respuestaCompra = await _compraService.BajaCompra(id);

            if (respuestaCompra.Failed)
            {
                if (respuestaCompra.status == Status.NotFound)
                    return NotFound(respuestaCompra.Error);

                if (respuestaCompra .status == Status.WithoutChanges)
                    return StatusCode(304, respuestaCompra.Error);

                if (respuestaCompra.status == Status.None)
                    return StatusCode(500, respuestaCompra.Error);
            }

            return NoContent();
        }

    }
}
