using System;
using Api.Dto.TrabajadorDtos;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery.ITrabajadorRepositery;

public interface ITrabajador : IService<Trabajadore>
{

    Task<Result<CrearTrabajadorDto>> CrearTrabajador(CrearTrabajadorDto CrearTrabajador);

}
