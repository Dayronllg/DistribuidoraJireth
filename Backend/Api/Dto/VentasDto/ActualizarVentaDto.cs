using System;
using Api.Dto.VentasDto.DetalleVentaDto;

namespace Api.Dto.VentasDto;

public class ActualizarVentaDto
{
   public int IdVenta { get; set; }

    public decimal TotalVenta { get; set; }

    public DateOnly Fecha { get; set; }

    public string Estado { get; set; } = null!;

    public int IdCliente { get; set; }

    public int IdUsuario { get; set; }

     public ICollection<ActualizarDetalleVentaDto> DetalleVenta { get; set; } = new List<ActualizarDetalleVentaDto>();


}
