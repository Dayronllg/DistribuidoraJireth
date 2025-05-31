using System;
using Api.Dto;
using Api.Dto.TrabajadorDtos;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class TrabajadorService : Service<Trabajadore>, ITrabajador
{
    private readonly DistribuidoraContext _Context;
    private readonly IMapper _mapper;

    public TrabajadorService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _Context = context;
        _mapper = mapper;
    }

    public async Task<ResultNoValue> BajaTrabajador(int id)
    {
        var entity = await base.Exists(x => x.IdTrabajador == id && x.Estado == "activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error);
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error);

        return ResultNoValue.Ok();
    }

    public async Task<Result<CrearTrabajadorDto>> CrearTrabajador(CrearTrabajadorDto CrearTrabajador)
    {
        var MapTrabajador = _mapper.Map<Trabajadore>(CrearTrabajador);
        var result = await base.create(MapTrabajador);

        return Result<CrearTrabajadorDto>.Ok(CrearTrabajador);

    }

    public async Task<PaginacionResultado<PaginarTrabajadorDto>> PaginarTrabajador( int pagina, int tamanioPagina)
    {
        var query =  _Context.Trabajadores.AsQueryable();
        var PagTrabajador = await base.PaginarAsync(query, pagina, 20, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Trabajadore, PaginarTrabajadorDto>(PagTrabajador,_mapper);
    }
}
