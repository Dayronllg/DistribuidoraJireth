using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class DetalleVenta
{
    public int IdDetalle { get; set; }

    public int Cantidad { get; set; }

    public decimal Precio { get; set; }

    public decimal Subtotal { get; set; }

    public int IdVenta { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }

    public virtual Presentacione IdPresentacionNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;

    public virtual Venta IdVentaNavigation { get; set; } = null!;
}
