using System;

namespace Api.Dto.RepotesDto.ReporteDeVentasDto;

public class FiltroFechaInicioYFinDto
{
    public DateOnly FechaInicio { get; set; }
    public DateOnly FechaFin { get; set; }
}
