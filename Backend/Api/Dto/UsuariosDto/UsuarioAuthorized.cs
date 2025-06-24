using System;
using System.IdentityModel.Tokens.Jwt;

namespace Api.Dto.UsuariosDto;

public class UsuarioAuthorized
{
    public UsuarioAuthorized(string tokens, string rol, int id)
    {
        Tokens = tokens;
        Rol = rol;
        IdUsuario = id;
    }

    public string Tokens { get; set; }

    public string Rol { get; set; } = null!;

    public int IdUsuario { get; set; }

}
