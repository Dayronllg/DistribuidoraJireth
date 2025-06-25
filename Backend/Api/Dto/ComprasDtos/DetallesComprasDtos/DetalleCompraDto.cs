using System;

namespace Api.Dto.ComprasDtos.DetallesComprasDtos;

public class DetalleCompraDto
{

    public string Cantidad { get; set; } = null!;

    public int IdCompra { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

   

}
