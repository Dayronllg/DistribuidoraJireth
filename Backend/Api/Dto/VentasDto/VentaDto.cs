using System;
using Api.Dto.VentasDto.DetalleVentaDto;

public class VentaDto
{
    public int IdVenta { get; set; }

    public decimal TotalVenta { get; set; }

    public DateOnly Fecha { get; set; }

    public string Estado { get; set; } = null!;

    public int IdCliente { get; set; }

    public int IdUsuario { get; set; }

    public ICollection<DetalleVentaDto> DetalleVenta { get; set; } = new List<DetalleVentaDto>();


}
