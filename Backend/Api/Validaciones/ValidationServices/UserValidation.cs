using System;
using Api.Dto;
using Api.Dto.UsuariosDto;
using Api.Models;
using Api.Security;
using Api.Validaciones.IValidationsService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Validaciones.ValidationServices;

public class UserValidation : IUserValidation
{
    private readonly DistribuidoraContext _context;
    private readonly Utilidad _utilidad;

    private readonly IMapper _map;

    public UserValidation(DistribuidoraContext context, Utilidad utilidad, IMapper map)
    {
        _context = context;
        _utilidad = utilidad;
        _map = map;
    }

    public async Task<Result<UsuarioDto>> ValidarLogin(UsuarioLogDto usuariolog)
    {
        string password = _utilidad.encriptar( usuariolog.Contrasena);

        var usuario =await _context.Usuarios.Include(x => x.IdRolNavigation).Where(x => x.Contrasena == password
        && usuariolog.NombreUsuario == x.NombreUsuario && x.Estado == "Activo").Select(x=> new UsuarioDto
        {
            IdUsuario= x.IdUsuario,
            NombreUsuario=x.NombreUsuario,
            Rol= x.IdRolNavigation.Nombre
            
        }).FirstOrDefaultAsync();
        if (usuario == null)
        {
            return Result<UsuarioDto>.Fail("Credenciales Incorrectas");
        }

        return Result<UsuarioDto>.Ok(_map.Map<UsuarioDto>(usuario));
    }

    public async Task<Result<Usuario>> ValidarNombreUsuario(Usuario usuario)
    {
        if (await _context.Usuarios.AnyAsync(x => x.NombreUsuario == usuario.NombreUsuario) == true)
        {
            return Result<Usuario>.Fail("El nombre de Usuario ya existe");
        }

        return Result<Usuario>.Ok(usuario);
    }
    //await _context.Usuarios.FirstOrDefaultAsync(x => x.Contrasena == password
       // && usuariolog.NombreUsuario == x.NombreUsuario && x.Estado=="Activo" );

}
