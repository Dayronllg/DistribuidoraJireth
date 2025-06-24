using System;
using Api.Dto;
using Api.Dto.UsuariosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Security;
using Api.Validaciones;
using Api.Validaciones.IValidationsService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery;

public class UserService : Service<Usuario>, IUserService
{
    private readonly DistribuidoraContext _context;
    private readonly Utilidad _utilidad;
    private readonly IUserValidation _validation;

    public UserService(DistribuidoraContext context, Utilidad utilidad, IUserValidation validation) : base(context)
    {
        _context = context;
        _utilidad = utilidad;
        _validation = validation;
    }

    public async Task<bool> ValidarUsuario(UsuarioLogDto usuario)
    {

        if (await _context.Usuarios.FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario && u.Contrasena == usuario.Contrasena) == null)
        {
            return false;
        }
        return true;
    }

    public override async Task<Result<Usuario>> create(Usuario u)
    {
        u.Contrasena = _utilidad.encriptar(u.Contrasena);

        var result = await _validation.ValidarNombreUsuario(u);

        if (result.Failed)
        {
            return result;
        }

        await base.create(u);

        return Result<Usuario>.Ok(u);
    }

    public async Task<Result<UsuarioDto>> Login(UsuarioLogDto usuarioLog)
    {
        var result = await _validation.ValidarLogin(usuarioLog);
        
        return result;
    }
}

//if (await _context.Usuarios.FirstOrDefaultAsync(x => x.NombreUsuario == u.NombreUsuario) is not null)
           // return Result<Usuario>.Fail("El Nombre de usuario esta en uso");//