using Api.Dto.PresentacionesDto;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PresentacionesController : ControllerBase
    {
        private readonly IPresentacionService _presentacionService;

        public PresentacionesController(IPresentacionService presentacionService)
        {
            _presentacionService = presentacionService;
        }
        
         [HttpPost("CrearPresentacion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CrearPresentacion([FromBody] CrearPresentacionDto crear)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var RespuestaProducto = await _presentacionService.CrearPresentacion(crear);

            if (RespuestaProducto.Failed)
                return Conflict(RespuestaProducto.Error);

            return Ok(RespuestaProducto.Value);
        }

        [HttpGet("ObtenerPresentaciones")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(int pagina, int tamanioPagina)
        {
            var result = await _presentacionService.PaginarPresentacion(pagina, tamanioPagina);

            return Ok(result);
        }

        [HttpPut("BajaPresentaciones")]
        public async Task<IActionResult> Baja(int id)
        {
            var result = await _presentacionService.BajaPresentacion(id);
            
            if (result.Failed)
                return NotFound(result.Error);

            return Ok();

        }

        [HttpPut("ActualizarPresentacion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarPresentacion(ActualizarPresentacionDto PresentacionDto)
        {
            var ActualizarRespuesta = await _presentacionService.ActualizarPresentacion(PresentacionDto);

            if (ActualizarRespuesta.status == Status.NotFound)
                return NotFound(ActualizarRespuesta.Error);

            if (ActualizarRespuesta.status == Status.WithoutChanges)
                return StatusCode(304, ActualizarRespuesta.Error);

            if (ActualizarRespuesta.status == Status.None)
                return StatusCode(500, ActualizarRespuesta.Error);

            return Ok(ActualizarRespuesta.Value);
        }
        
    }
}
