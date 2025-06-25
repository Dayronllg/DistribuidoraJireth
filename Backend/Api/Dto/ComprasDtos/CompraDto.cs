using System;
using Api.Dto.ComprasDtos.DetallesComprasDtos;

namespace Api.Dto.ComprasDtos;

public class CompraDto
{
    public int IdCompra { get; set; }

    public decimal TotalCompra { get; set; }

    public int IdPedido { get; set; }

    public string Estado { get; set; } = null!;

    public virtual ICollection<DetalleCompraDto> DetalleCompras { get; set; } = new List<DetalleCompraDto>();
    
    
}
