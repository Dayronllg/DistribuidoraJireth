using System;

namespace Api.Dto.RolesDto;

public class RolDto
{
   public int IdRol { get; set; }

   public string Nombre { get; set; } = null!;

   public string Estado { get; set; } = null!;

}
