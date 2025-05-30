using System;
using Api.Models;

namespace Api.Dto.UsuariosDto;

public class UsuarioCreateDto
{
  
    public string NombreUsuario { get; set; } = null!;

    public string Contrasena { get; set; } = null!;

    public int IdRol { get; set; } 

    public int IdTrabajador { get; set; }

   
}
