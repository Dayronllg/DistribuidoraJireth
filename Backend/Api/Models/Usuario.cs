using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string NombreUsuario { get; set; } = null!;

    public string Contrasena { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int IdTrabajador { get; set; }

    public int IdRol { get; set; }

    public virtual Role IdRolNavigation { get; set; } = null!;

    public virtual Trabajadore IdTrabajadorNavigation { get; set; } = null!;

    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
