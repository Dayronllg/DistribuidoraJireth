using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DevolucionVentum
{
    public int IdDevVenta { get; set; }

    public int IdVenta { get; set; }

    public DateOnly Fecha { get; set; }

    public virtual ICollection<DetalleDevVentum> DetalleDevVenta { get; set; } = new List<DetalleDevVentum>();

    public virtual Venta IdVentaNavigation { get; set; } = null!;
}
