using System;

namespace Api.Dto.RepotesDto.ReporteDeVentasDto;

public class DetalleVentasReportesDto
{
   public int IdVenta { get; set; }
    public DateOnly FechaVenta { get; set; }
    public string? ClienteNombre { get; set; }
    public required  string ProductoNombre { get; set; }
    public  required string PresentacionNombre { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
}
