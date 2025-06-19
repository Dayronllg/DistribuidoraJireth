using System;
using Api.Dto;
using Api.Dto.MarcasDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery.ITrabajadorRepositery;

public interface IMarcaService : IService<Marca>
{
    
    Task<Result<MarcaDto>> CrearMarca(CrearMarcaDto CrearMarca);
    Task<PaginacionResultado<MarcaDto>> PaginarMarca(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaMarca(int id);
    Task<Result<MarcaDto>> ActualizarMarca(MarcaDto ActualizarMarca);

}
