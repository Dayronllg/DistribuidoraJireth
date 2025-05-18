using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DevolucionCompra
{
    public int IdDevCompra { get; set; }

    public int IdCompra { get; set; }

    public DateOnly Fecha { get; set; }

    public virtual ICollection<DetalleDevoCompra> DetalleDevoCompras { get; set; } = new List<DetalleDevoCompra>();

    public virtual Compra IdCompraNavigation { get; set; } = null!;
}
