using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Venta
{
    public int IdVenta { get; set; }

    public decimal TotalVenta { get; set; }

    public DateOnly Fecha { get; set; }

    public string Estado { get; set; } = null!;

    public int IdCliente { get; set; }

    public int IdUsuario { get; set; }

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();

    public virtual ICollection<DevolucionVentum> DevolucionVenta { get; set; } = new List<DevolucionVentum>();

    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
