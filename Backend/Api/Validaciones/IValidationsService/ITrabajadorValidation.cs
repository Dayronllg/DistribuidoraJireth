using System;
using Api.Dto.TrabajadorDtos;
using Api.Models;

namespace Api.Validaciones.IValidationsService;

public interface ITrabajadorValidation
{
    Task<Result<Trabajadore>> Validar(CrearTrabajadorDto validarTrabajador);
 
}
