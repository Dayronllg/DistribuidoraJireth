using System;
using Api.Dto.VentasDto.DetalleVentaDto;

namespace Api.Dto.VentasDto;

public class CrearVentaDto
{
  public decimal TotalVenta { get; set; }

    public DateOnly Fecha = DateOnly.FromDateTime(DateTime.Now);

    public int IdCliente { get; set; }

    public int IdUsuario { get; set; }

    public  ICollection<CrearDetalleVentaDto> DetalleVenta { get; set; } = new List<CrearDetalleVentaDto>();
}
