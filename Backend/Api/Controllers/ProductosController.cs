using Api.Dto.ProductosDto;
using Api.Repositery.IRepositery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductService _product;

        public ProductosController(IProductService product)
        {
            _product = product;
        }

        [HttpPost("CrearProducto")]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CrearProducto([FromBody] ProductoDto productoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var ProductResult = await _product.CrearProducto(productoDto);

            if (ProductResult.Failed)
                return Conflict(ProductResult.Error);

            return Created("api/[controller]/CrearProducto", ProductResult.Value);

        }
    }
}
