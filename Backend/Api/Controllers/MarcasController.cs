
using Api.Dto.MarcasDto;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcasController : ControllerBase
    {
        private readonly IMarcaService _marca;

        public MarcasController(IMarcaService marca)
        {
            _marca = marca;
        }

        [HttpPost("CrearMarca")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CrearMarca([FromBody] CrearMarcaDto crear)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var RespuestaMarca = await _marca.CrearMarca(crear);

            if (RespuestaMarca.Failed)
                return Conflict(RespuestaMarca.Error);

            return Ok(RespuestaMarca.Value);
        }

        [HttpGet("ObtenerMarcas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(int pagina, int tamanioPagina)
        {
            var result = await _marca.PaginarMarca(pagina, tamanioPagina);

            return Ok(result);
        }

        [HttpPut("BajaMarca")]
        public async Task<IActionResult> Baja(int id)
        {
            var result = await _marca.BajaMarca(id);
            
            if (result.Failed)
                return NotFound(result.Error);

            return Ok();

        }

        [HttpPut("ActualizarMarca")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status304NotModified)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarMarca(MarcaDto MarcaDto)
        {
            var ActualizarRespuesta = await _marca.ActualizarMarca(MarcaDto);

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
