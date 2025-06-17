using System;
using System.Linq.Expressions;
using Api.Dto;
using Api.Dto.ProveedoresDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class ProveedorService : Service<Proveedore>, IProvedorService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public ProveedorService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _context = context;
        _mapper = mapper;
    }
   
    

    public  async Task<Result<ProveedorDto>> ActualizarProveedor(ProveedorDto ActProveedor)
    {
        var ProveedorExiste= await base.Exists(x=> x.Ruc==ActProveedor.Ruc);

        if(ProveedorExiste.Failed)
           return Result<ProveedorDto>.Fail(ProveedorExiste.Error,Status.Conflict);

           var ProveedorAct= await base.UpdateEntity(_mapper.Map<Proveedore>(ActProveedor));

        if (ProveedorAct.Failed)
            return Result<ProveedorDto>.Fail(ProveedorAct.Error);
           

           return Result<ProveedorDto>.Ok(_mapper.Map<ProveedorDto>(ProveedorAct.Value));
    }

    public async Task<ResultNoValue> BajaProveedor(string id)
    {
       var entity = await base.Exists(x => x.Ruc == id && x.Estado == "Activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<ProveedorDto>> CrearProvedor(CrearProveedorDto crearProveedor)
    {
        var ValidarProveedor = await base.Exists(x => x.Ruc == crearProveedor.Ruc && x.Estado == "Activo");

        if (ValidarProveedor.Value !=null)
            return Result<ProveedorDto>.Fail("El proveedor ya existe", Status.Conflict);
            
        var RespuestaProveedor = await base.create(_mapper.Map<Proveedore>(crearProveedor));

        if (RespuestaProveedor.Failed)
            return Result<ProveedorDto>.Fail(RespuestaProveedor.Error);

        return Result<ProveedorDto>.Ok(_mapper.Map<ProveedorDto>(RespuestaProveedor.Value));

    }

    public async Task<PaginacionResultado<ProveedorDto>> ObtenerProvedores(int pagina, int tamanio)
    {
        var query = _context.Proveedores.AsQueryable();

        var PagProveedores = await base.PaginarAsync(query, pagina, tamanio, x => x.Estado == "Activo");

        return MapearPaginador.MapearPaginacion<Proveedore,ProveedorDto>(PagProveedores,_mapper);
    }

}
