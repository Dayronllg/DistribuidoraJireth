using System;
using Api.Dto.RepotesDto.ReporteDeVentasDto;
using Api.Models;

namespace Api.Repositery.IRepositery;

public interface IReporteService:IService<Venta>
{
    Task<ReporteDeVentsDto> CrearReporteDeVentas(FiltroFechaInicioYFinDto filtroFecha);
}
