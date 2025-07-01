using System;
using Api.Dto;
using Api.Dto.PresentacionesDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class PresentacionService : Service<Presentacione>, IPresentacionService
{
    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public PresentacionService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PresentacionDto>> ActualizarPresentacion(ActualizarPresentacionDto ActualizarPresentacion)
    {
       var PresentacionRespuesta = await base.Exists(x => x.IdPresentacion == ActualizarPresentacion.IdPresentacion
                                        && x.Estado == "Activo");

        if (PresentacionRespuesta.Failed)
            return Result<PresentacionDto>.Fail(PresentacionRespuesta.Error, PresentacionRespuesta.status);

        _mapper.Map(ActualizarPresentacion,PresentacionRespuesta.Value);

        var SuccessUpdated = await base.UpdateEntity( _mapper.Map(ActualizarPresentacion,PresentacionRespuesta.Value));

        if (SuccessUpdated.Failed)
            return Result<PresentacionDto>.Fail(SuccessUpdated.Error, SuccessUpdated.status);

        return Result<PresentacionDto>.Ok(_mapper.Map<PresentacionDto>(SuccessUpdated.Value));
    }

    public async Task<ResultNoValue> BajaPresentacion(int id)
    {
       var entity = await base.Exists(x => x.IdPresentacion == id && x.Estado == "Activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
         if (entity.Value.Inventario> 0)
         return ResultNoValue.Fail("No puedes dar de baja la presentación mientras tenga inventario. Primero realiza un ajuste de inventario.");   
         
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<PresentacionDto>> CrearPresentacion(CrearPresentacionDto CrearPresentacion)
    {
        var ValidarProveedor = await base.Exists(x => x.Nombre.ToLower() == CrearPresentacion.Nombre.ToLower()
         && x.IdProductos == CrearPresentacion.IdProductos && x.Estado=="Activo");

        if (ValidarProveedor.Value !=null)
            return Result<PresentacionDto>.Fail("La Presentacion para este producto ya existe", Status.Conflict);
            
        var RespuestaProveedor = await base.create(_mapper.Map<Presentacione>(CrearPresentacion));

        if (RespuestaProveedor.Failed)
            return Result<PresentacionDto>.Fail(RespuestaProveedor.Error);

        return Result<PresentacionDto>.Ok(_mapper.Map<PresentacionDto>(RespuestaProveedor.Value));

    }

    public async Task<PaginacionResultado<PresentacionDto>> PaginarPresentacion(int pagina, int tamanioPagina)
    {
         var query =  _context.Presentaciones.AsQueryable();
        var PagPresentacion = await base.PaginarAsync(query, pagina, tamanioPagina, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Presentacione,PresentacionDto>(PagPresentacion,_mapper);
    }
}
