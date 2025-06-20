using System;
using Api.Dto;
using Api.Dto.PedidosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Api.Repositery.ServiceRepositery;

public class PedidoService : Service<Pedido>, IPedidoRepositery
{
    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public PedidoService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PedidoDto>> ActualizarPedido(PedidoDto ActualizarPedido)
    {
        var PedidoExistente = await Exists(x => x.IdPedido == ActualizarPedido.IdPedido);

        if (PedidoExistente.Value == null)
            return Result<PedidoDto>.Fail(PedidoExistente.Error, Status.NotFound);

        var PedidoActualizado = await UpdateEntity(_mapper.Map(ActualizarPedido, PedidoExistente.Value));

        if (PedidoActualizado.Failed)
            return Result<PedidoDto>.Fail(PedidoActualizado.Error, PedidoActualizado.status);

        return Result<PedidoDto>.Ok(_mapper.Map<PedidoDto>(PedidoActualizado));
    }

    public async Task<ResultNoValue> BajaPedido(int id)
    {
        var PedidoExistente = await Exists(x => x.IdPedido == id);

        if (PedidoExistente.Failed)
            return ResultNoValue.Fail(PedidoExistente.Error, PedidoExistente.status);

        PedidoExistente.Value.Estado = "Cancelado";
        var PedidoActualizado = await UpdateEntity(PedidoExistente.Value);

        if (PedidoActualizado.Failed)
            return ResultNoValue.Fail(PedidoActualizado.Error, PedidoActualizado.status);

        return ResultNoValue.Ok();
       
         
    }

    public async Task<Result<PedidoDto>> CrearPedido(CrearPedidoDto CrearPedido)
    {
        var PedidoCreado = await create(_mapper.Map<Pedido>(CrearPedido));

        if (PedidoCreado.Failed)
            return Result<PedidoDto>.Fail(PedidoCreado.Error, PedidoCreado.status);

        return Result<PedidoDto>.Ok(_mapper.Map<PedidoDto>(PedidoCreado.Value)); 
    }

    public async Task<PaginacionResultado<PedidoDto>> PaginarPedido(int pagina, int tamanioPagina)
    {
        var query = _context.Pedidos.AsQueryable();
        var PaginacionPedido = await PaginarAsync(query, tamanioPagina, pagina, x => x.Estado == "En espera");

        return MapearPaginador.MapearPaginacion<Pedido, PedidoDto>(PaginacionPedido,_mapper);
    }
}
