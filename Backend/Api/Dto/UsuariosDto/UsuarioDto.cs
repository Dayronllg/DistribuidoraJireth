using System;

namespace Api.Dto.UsuariosDto;

public class UsuarioDto
{
  public int IdUsuario { get; set; }

    public string NombreUsuario { get; set; } = null!;

    public string Rol { get; set; } = null!;

    public int IdTrabajador { get; set; }

    
}
