using System;
using Api.Dto;
using Api.Dto.UsuariosDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IUserService : IService<Usuario>
{
    Task<bool> ValidarUsuario(UsuarioLogDto usuario);
    Task<Result<UsuarioDto>> Login(UsuarioLogDto usuarioLog);

    
}
