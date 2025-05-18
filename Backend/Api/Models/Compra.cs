using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Compra
{
    public int IdCompra { get; set; }

    public decimal TotalCompra { get; set; }

    public int IdPedido { get; set; }

    public string Estado { get; set; } = null!;

    public virtual ICollection<DetalleCompra> DetalleCompras { get; set; } = new List<DetalleCompra>();

    public virtual ICollection<DevolucionCompra> DevolucionCompras { get; set; } = new List<DevolucionCompra>();

    public virtual Pedido IdPedidoNavigation { get; set; } = null!;
}
