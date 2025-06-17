using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery.ServiceRepositery;

public class ClienteJuridicoService : Service<Cliente>, IClienteJuridicoService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public ClienteJuridicoService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<ClienteJuridicoDto>> ActualizarClienteJuridico(ClienteJuridicoDto ActClienteJuridico)
    {
        var ClienteExiste = await _context.Clientes.Include(x => x.ClienteJuridico).
        FirstOrDefaultAsync(x=> x.ClienteJuridico!=null && x.ClienteJuridico.Ruc==ActClienteJuridico.ClienteJuridico.Ruc && x.Estado=="Activo");

        if(ClienteExiste==null)
           return Result<ClienteJuridicoDto>.Fail("El cliente No existe",Status.Conflict);

           var ClienteAct= await base.UpdateEntity(_mapper.Map(ActClienteJuridico,ClienteExiste));

        if (ClienteAct.Failed)
            return Result<ClienteJuridicoDto>.Fail(ClienteAct.Error);
           

           return Result<ClienteJuridicoDto>.Ok(_mapper.Map<ClienteJuridicoDto>(ClienteAct.Value));
    }

    public async Task<ResultNoValue> BajaClienteJuridico(string id)
    {
        var entity = await base.Exists(x => x.ClienteJuridico.Ruc == id
        && x.Estado == "Activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<ClienteJuridicoDto>> CrearClienteJuridico(CrearClienteJuridicoDto crearClienteJuridico)
    {
          var entity = await base.Exists(x => x.ClienteJuridico.Ruc == crearClienteJuridico.ClienteJuridico.Ruc
        && x.Estado == "Activo");
        if (entity.Value !=null)
            return Result<ClienteJuridicoDto>.Fail(entity.Error,Status.Conflict);

         var RespuestaClienteJuridico = await base.create(_mapper.Map<Cliente>(crearClienteJuridico));

        if (RespuestaClienteJuridico.Failed)
            return Result<ClienteJuridicoDto>.Fail(RespuestaClienteJuridico.Error);

        return Result<ClienteJuridicoDto>.Ok(_mapper.Map<ClienteJuridicoDto>(RespuestaClienteJuridico.Value));
    }

    public async Task<PaginacionResultado<ClienteJuridicoDto>> ObtenerClientesJuridicos(int pagina, int tamanio)
    {

        var query = _context.Clientes.Include(x => x.ClienteJuridico).AsQueryable();

        var PagClientes = await base.PaginarAsync(query, pagina, tamanio, x => x.Estado == "Activo");

        return MapearPaginador.MapearPaginacion<Cliente,ClienteJuridicoDto>(PagClientes,_mapper);
    }
}
