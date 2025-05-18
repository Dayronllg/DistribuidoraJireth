using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Api.Dto.UsuariosDto;
using Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace Api.Security;

public class Utilidad
{
    
     private readonly IConfiguration _manager;

    public Utilidad(IConfiguration manager)
    {
        _manager = manager;
    }

    public string encriptar(string texto)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(texto));
            StringBuilder builder = new();

            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }


    }

    public string GenerarToken(UsuarioDto usuario)
    {
        var userClaims = new[]
        {
          new Claim(ClaimTypes.NameIdentifier,usuario.IdUsuario.ToString()),
          new Claim(ClaimTypes.Name, usuario.NombreUsuario.ToString()),
          new Claim(ClaimTypes.Role, usuario.Rol.ToString())
        };

        var SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_manager["Jwt:key"]!));
        var credentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256Signature);
        var jwtDetail = new JwtSecurityToken(
            claims: userClaims,
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(jwtDetail);
    }
}



