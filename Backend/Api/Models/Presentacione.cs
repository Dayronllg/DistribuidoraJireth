using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Presentacione
{
    public int IdPresentacion { get; set; }

    public string Nombre { get; set; } = null!;

    public decimal Precio { get; set; }

    public int Inventario { get; set; }

    public string Estado { get; set; } = null!;

    public int IdProductos { get; set; }

    public virtual ICollection<DetalleCompra> DetalleCompras { get; set; } = new List<DetalleCompra>();

    public virtual ICollection<DetalleDevVentum> DetalleDevVenta { get; set; } = new List<DetalleDevVentum>();

    public virtual ICollection<DetalleDevoCompra> DetalleDevoCompras { get; set; } = new List<DetalleDevoCompra>();

    public virtual ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();

    public virtual Producto IdProductosNavigation { get; set; } = null!;
}
