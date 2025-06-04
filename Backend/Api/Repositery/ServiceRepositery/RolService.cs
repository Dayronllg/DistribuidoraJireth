using System;
using Api.Dto;
using Api.Dto.RolesDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class RolService : Service<Role>, IRolService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public RolService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ResultNoValue> BajaRol(int id)
    {
       var entity = await base.Exists(x => x.IdRol == id && x.Estado == "activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error,Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<RolDto>> CrearRol(CrearRolDto CrearROl)
    {
        var MapRol = _mapper.Map<Role>(CrearROl);
        var result = await base.create(MapRol);

        return Result<RolDto>.Ok(_mapper.Map<RolDto>(result.Value));
    }

    public async Task<PaginacionResultado<RolDto>> PaginarRol(int pagina, int tamanioPagina)
    {
         var query =  _context.Roles.AsQueryable();
        var PagRole = await base.PaginarAsync(query, pagina, tamanioPagina, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Role, RolDto>(PagRole,_mapper);
    }

    
}
