using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DetalleDevoCompra
{
    public int Cantidad { get; set; }

    public int IdDevCompra { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

    public virtual DevolucionCompra IdDevCompraNavigation { get; set; } = null!;

    public virtual Presentacione IdPresentacionNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
