using Api.Dto.RepotesDto.ReporteDeVentasDto;
using Api.Repositery.IRepositery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly IReporteService _reporteService;

        public ReportesController(IReporteService reporteService)
        {
            _reporteService = reporteService;
        }

        [HttpPost("CrearReporteDEVentas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CrearReporteDeVentas(FiltroFechaInicioYFinDto fecha)
        {
            var ReporteDeVenta = await _reporteService.CrearReporteDeVentas(fecha);
            return Ok(ReporteDeVenta);
        }
    }
}
