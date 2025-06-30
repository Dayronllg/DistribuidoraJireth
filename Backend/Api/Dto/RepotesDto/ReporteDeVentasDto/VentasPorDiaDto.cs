using System;

namespace Api.Dto.RepotesDto.ReporteDeVentasDto;

public class VentasPorDiaDto
{
    public DateOnly Fecha { get; internal set; }
    public int CantidadVentas { get; internal set; }
    public decimal MontoTotal { get; internal set; }
}
