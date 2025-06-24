using System;

namespace Api.Dto.VentasDto.DetalleVentaDto;

public class CrearDetalleVentaDto
{
    public int Cantidad { get; set; }

    public decimal Precio { get; set; }

    public decimal Subtotal { get; set; }

  

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

}
