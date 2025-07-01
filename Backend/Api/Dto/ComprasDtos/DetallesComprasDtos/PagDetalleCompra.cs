using System;
using Api.Dto.PresentacionesDto;
using Api.Dto.ProductosDto;

namespace Api.Dto.ComprasDtos.DetallesComprasDtos;

public class PagDetalleCompra
{

  public int Cantidad { get; set; }

    public int IdCompra { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }


    public  PresentacionDto IdPresentacionNavigation { get; set; } = null!;

    public  ProductoDto IdProductoNavigation { get; set; } = null!;

}
