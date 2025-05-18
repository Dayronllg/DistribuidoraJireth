using Api.Dto;
using Api.Dto.UsuariosDto;
using Api.Models;

namespace Api.Validaciones.IValidationsService;

public interface IUserValidation
{
  Task<Result<Usuario>> ValidarNombreUsuario(Usuario usuario);
  Task<Result<UsuarioDto>> ValidarLogin(UsuarioLogDto usuario);

}
