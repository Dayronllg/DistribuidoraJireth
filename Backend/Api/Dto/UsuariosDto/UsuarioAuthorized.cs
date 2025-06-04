using System;
using System.IdentityModel.Tokens.Jwt;

namespace Api.Dto.UsuariosDto;

public class UsuarioAuthorized
{
    public UsuarioAuthorized(string tokens, string rol)
    {
        Tokens = tokens;
        Rol = rol;
    }

    public string Tokens { get; set; }
  
        public string Rol { get; set; } = null!;

}
