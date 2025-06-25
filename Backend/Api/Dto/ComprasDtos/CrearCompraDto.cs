using System;
using Api.Dto.ComprasDtos.DetallesComprasDtos;

namespace Api.Dto.ComprasDtos;

public class CrearCompraDto
{ 
   public decimal TotalCompra { get; set; }

    public int IdPedido { get; set; }

    public virtual ICollection<CrearDetalleCompraDto> DetalleCompras { get; set; } = new List<CrearDetalleCompraDto>();
    
}
