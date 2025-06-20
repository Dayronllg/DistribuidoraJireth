using Api.Dto.ProductosDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductService _productoService;

        public ProductosController(IProductService product)
        {
            _productoService = product;
        }

        [HttpGet("ObtenerProductos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ObtenerProducto(int Pagina, int TamanioPagina)
        {
            var RespuestaTrabajadores = await _productoService.PaginarProducto(Pagina, TamanioPagina);

            return Ok(RespuestaTrabajadores);
        }


        [HttpPost("CrearProducto")]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CrearProducto([FromBody] CrearProductoDto productoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ProductResult = await _productoService.CrearProducto(productoDto);

            if (ProductResult.Failed)
                return Conflict(ProductResult.Error);

            return Created("api/[controller]/CrearProducto", ProductResult.Value);

        }
        
         [HttpPut("BajaProducto")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> BajaProducto(int id)
        {
            var RespuestaProducto = await _productoService.BajaProducto(id);

            if (RespuestaProducto.Failed)
            {
                if (RespuestaProducto.status == Status.NotFound)
                    return NotFound(RespuestaProducto.Error);

                if (RespuestaProducto.status == Status.WithoutChanges)
                    return StatusCode(304, RespuestaProducto.Error);

                if (RespuestaProducto.status == Status.None)
                    return StatusCode(500, RespuestaProducto.Error);
            }

            return NoContent();
        }

        [HttpPut("ActualizarProducto")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarProductos([FromBody] ProductoDto ActualizarProducto)
        {
            var RespuestaProducto = await _productoService.ActualizarProducto(ActualizarProducto);

            if (RespuestaProducto.Failed)
            {
                if (RespuestaProducto.status == Status.Conflict)
                    return StatusCode(409, RespuestaProducto.Error);

                if (RespuestaProducto.status == Status.None)
                    return StatusCode(500, RespuestaProducto.Error);

            }

            return Ok(RespuestaProducto.Value);
        }
    }
}
