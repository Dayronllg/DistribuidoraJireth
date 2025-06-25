using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DetalleCompra
{
    public int Cantidad { get; set; }

    public int IdCompra { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

    public virtual Compra IdCompraNavigation { get; set; } = null!;

    public virtual Presentacione IdPresentacionNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
