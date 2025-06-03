using System;
using Api.Dto;
using Api.Dto.RolesDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IRolService: IService<Role>
{
    Task<Result<RolDto>> CrearRol(RolDto CrearROl);
    Task<PaginacionResultado<RolDto>> PaginarRol(int pagina, int tamanioPagina);

    Task<ResultNoValue>BajaRol(int id);
}
