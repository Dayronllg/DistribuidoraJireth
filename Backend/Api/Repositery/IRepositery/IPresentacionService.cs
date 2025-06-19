using System;
using Api.Dto;
using Api.Dto.PresentacionesDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IPresentacionService: IService<Presentacione>
{
    Task<Result<PresentacionDto>> CrearPresentacion(CrearPresentacionDto CrearPresentacion);
    Task<PaginacionResultado<PresentacionDto>> PaginarPresentacion(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaPresentacion(int id);
    Task<Result<PresentacionDto>> ActualizarPresentacion(ActualizarPresentacionDto ActualizarPresentacion);
}
