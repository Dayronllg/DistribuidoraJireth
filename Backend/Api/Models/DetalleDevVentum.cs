using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DetalleDevVentum
{
    public int IdDetalle { get; set; }

    public string Cantidad { get; set; } = null!;

    public int IdDevVenta { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

    public virtual DevolucionVentum IdDevVentaNavigation { get; set; } = null!;

    public virtual Presentacione IdPresentacionNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
