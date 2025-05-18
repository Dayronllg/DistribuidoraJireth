using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Pedido
{
    public int IdPedido { get; set; }

    public DateOnly FechaPedido { get; set; }

    public string? Ruc { get; set; }

    public string Estado { get; set; } = null!;

    public int IdUsuario { get; set; }

    public virtual Compra? Compra { get; set; }

    public virtual ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;

    public virtual Proveedore? RucNavigation { get; set; }
}
