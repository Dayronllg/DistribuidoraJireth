using System;
using Api.Dto.PresentacionesDto;
using Api.Dto.ProductosDto;

namespace Api.Dto.PedidosDto;

public class PagDetallePedidoCompra
{
 
    public int CantidadProducto { get; set; }

    public string Estado { get; set; } = null!;

    public int IdPedido { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

    public virtual PresentacionDto IdPresentacionNavigation { get; set; } = null!;

    public virtual ProductoDto IdProductoNavigation { get; set; } = null!;
}
