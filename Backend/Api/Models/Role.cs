﻿using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Role
{
    public int IdRol { get; set; }

    public string Nombre { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
