using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Trabajadore
{
    public int IdTrabajador { get; set; }

    public string PrimerNombre { get; set; } = null!;

    public string? SegundoNombre { get; set; }

    public string PrimerApellido { get; set; } = null!;

    public string? SegundoApellido { get; set; }

    public string Telefono { get; set; } = null!;

    public string? Estado { get; set; }

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
