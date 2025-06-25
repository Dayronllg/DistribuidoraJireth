using Api.Dto.PedidosDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidoRepositery _pedidoService;
        private readonly IDetallePedidoService _detallePedidoService;

        public PedidosController(IPedidoRepositery pedidoService, IDetallePedidoService detallePedidoService)
        {
            _pedidoService = pedidoService;
            _detallePedidoService = detallePedidoService;
        }

        [HttpGet("ObtenerPedidos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerPedidos(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _pedidoService.PaginarPedido(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }

        [HttpPost("CrearPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearPedido([FromBody] CrearPedidoDto CrearPedido)
        {
            var RespuestaPedido = await _pedidoService.CrearPedido(CrearPedido);
            if (RespuestaPedido.Failed)
            {
                if (RespuestaPedido.status == Status.Conflict)
                    return StatusCode(409, RespuestaPedido.Error);

                if (RespuestaPedido.status == Status.None)
                    return StatusCode(500, RespuestaPedido.Error);
            }

            return Ok(RespuestaPedido.Value);
        }

        [HttpPut("BajaPedido")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaPedido(int id)
        {
            var RespuestaPedido = await _pedidoService.BajaPedido(id);

            if (RespuestaPedido.Failed)
            {
                if (RespuestaPedido.status == Status.NotFound)
                    return NotFound(RespuestaPedido.Error);

                if (RespuestaPedido.status == Status.WithoutChanges)
                    return StatusCode(304, RespuestaPedido.Error);

                if (RespuestaPedido.status == Status.None)
                    return StatusCode(500, RespuestaPedido.Error);
            }

            return NoContent();
        }

        [HttpPut("ActualizarPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarPedidoes([FromBody] PedidoDto ActualizarProducto)
        {
            var RespuestaPedido = await _pedidoService.ActualizarPedido(ActualizarProducto);

            if (RespuestaPedido.Failed)
            {
                if (RespuestaPedido.status == Status.Conflict)
                    return StatusCode(409, RespuestaPedido.Error);

                if (RespuestaPedido.status == Status.None)
                    return StatusCode(500, RespuestaPedido.Error);

            }

            return Ok(RespuestaPedido.Value);
        }



        [HttpGet("ObtenerDetallePedidoCompra")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PagDetallePedidoCompra(int id)
        {
            var respuestPagDetallePedidoCompra = await _detallePedidoService.PagDetallePedidoVerificarCompra(id);

            return Ok(respuestPagDetallePedidoCompra);
        }
    }


}
