using System;
using Api.Dto.VentasDto.DetalleVentaDto;

namespace Api.Dto.RepotesDto.ReporteDeVentasDto;

public class ReporteDeVentsDto
{
    public int TotalVentas { get; set; }
    public decimal TotalMonto { get; set; }
    public decimal MontoPromedioPorVenta { get; set; }
    public decimal VentaMaxima { get; set; }
    public decimal VentaMinima { get; set; }
    public int TotalClientesUnicos { get; set; }
    public required List<VentasPorDiaDto> VentasPorDia { get; set; }
    public required List<DetalleVentaDto> Detalles { get; set; }
}

