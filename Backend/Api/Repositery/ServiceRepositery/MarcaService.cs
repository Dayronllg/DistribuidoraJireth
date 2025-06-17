using System;
using Api.Dto;
using Api.Dto.MarcasDto;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class MarcaService : Service<Marca>, IMarcaService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public MarcaService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<MarcaDto>> ActualizarMarca(MarcaDto ActualizarMarca)
    {
        var MarcaRespuesta = await base.Exists(x => x.IdMarca == ActualizarMarca.IdMarca
                                        && x.Estado == "Activo");

        if (MarcaRespuesta.Failed)
            return Result<MarcaDto>.Fail(MarcaRespuesta.Error, MarcaRespuesta.status);


        var SuccessUpdated = await base.UpdateEntity( _mapper.Map(ActualizarMarca,MarcaRespuesta.Value));

        if (SuccessUpdated.Failed)
            return Result<MarcaDto>.Fail(SuccessUpdated.Error, SuccessUpdated.status);

        return Result<MarcaDto>.Ok(_mapper.Map<MarcaDto>(SuccessUpdated.Value));
    }

    public async Task<ResultNoValue> BajaMarca(int id)
    {
         var entity = await base.Exists(x => x.IdMarca == id
                                        && x.Estado == "Activo");

        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<CrearMarcaDto>> CrearMarca(CrearMarcaDto CrearMarca)
    {
        var MapMarca = _mapper.Map<Marca>(CrearMarca);
        var result = await base.create(MapMarca);

        return Result<CrearMarcaDto>.Ok(CrearMarca);
    }

    public async Task<PaginacionResultado<MarcaDto>> PaginarMarca(int pagina, int tamanioPagina)
    {
        var Consulta =  _context.Marcas.AsQueryable();
        var PagTrabajador = await base.PaginarAsync(Consulta, pagina, tamanioPagina, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Marca,MarcaDto>(PagTrabajador,_mapper);
    }
}
