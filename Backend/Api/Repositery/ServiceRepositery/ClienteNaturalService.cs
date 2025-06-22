using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery.ServiceRepositery;

public class ClienteNaturalService : Service<Cliente>, IClienteNatural
{
    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public ClienteNaturalService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<ClienteNaturalDto>> ActualizarClienteNatural(ClienteNaturalDto ActClienteNatural)
    {
        var ClienteExiste = await _context.Clientes.Include(x => x.ClienteNatural).
        FirstOrDefaultAsync(x=> x.ClienteNatural!=null && x.ClienteNatural.IdCliente==ActClienteNatural.IdCliente && x.Estado=="Activo");
        if(ClienteExiste==null)
           return Result<ClienteNaturalDto>.Fail("El cliente no existe",Status.Conflict);

           var ClienteAct= await base.UpdateEntity(_mapper.Map(ActClienteNatural,ClienteExiste));

        if (ClienteAct.Failed)
            return Result<ClienteNaturalDto>.Fail(ClienteAct.Error);
           

           return Result<ClienteNaturalDto>.Ok(_mapper.Map<ClienteNaturalDto>(ClienteAct.Value));
    }

    public async Task<ResultNoValue> BajaClienteNatural(int id)
    {
         var entity = await base.Exists(x => x.IdCliente == id && x.Estado == "Activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<ClienteNaturalDto>> CrearClientNatural(CrearClienteNaturalDto crearClienteNatural)
    {
        
        var RespuestaClienteNatural = await base.create(_mapper.Map<Cliente>(crearClienteNatural));

        if (RespuestaClienteNatural.Failed)
            return Result<ClienteNaturalDto>.Fail(RespuestaClienteNatural.Error);

        return Result<ClienteNaturalDto>.Ok(_mapper.Map<ClienteNaturalDto>(RespuestaClienteNatural.Value));
    }

    public async Task<PaginacionResultado<ClienteNaturalDto>> ObtenerClientesNaturales(int pagina, int tamanio)
    {
         var query = _context.Clientes.Include(x=>x.ClienteNatural).Where(x=>x.ClienteNatural!=null).AsQueryable();

        var PagClientes = await base.PaginarAsync(query, pagina, tamanio, x => x.Estado == "Activo");

        return MapearPaginador.MapearPaginacion<Cliente,ClienteNaturalDto>(PagClientes,_mapper);
    }
}
