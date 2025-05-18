using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DetallePedido
{
    public int IdDetalle { get; set; }

    public int CantidadProducto { get; set; }

    public string Estado { get; set; } = null!;

    public int? IdPedido { get; set; }

    public int? IdProducto { get; set; }

    public virtual Pedido? IdPedidoNavigation { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }
}
