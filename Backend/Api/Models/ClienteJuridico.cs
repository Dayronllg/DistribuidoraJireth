using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class ClienteJuridico
{
    public string Ruc { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public int IdCliente { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; } = null!;
}
