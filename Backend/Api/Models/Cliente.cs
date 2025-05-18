using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public virtual ClienteJuridico? ClienteJuridico { get; set; }

    public virtual ClienteNatural? ClienteNatural { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
