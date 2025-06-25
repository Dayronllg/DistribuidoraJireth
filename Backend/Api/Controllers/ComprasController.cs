using Api.Dto.ComprasDtos;
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

        public ComprasController(ICompraService compraService)
        {
            _compraService = compraService;
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

    }
}
