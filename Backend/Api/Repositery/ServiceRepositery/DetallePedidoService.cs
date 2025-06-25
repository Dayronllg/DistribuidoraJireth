using System;
using Api.Dto;
using Api.Dto.PedidosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery.ServiceRepositery;

public class DetallePedidoService : Service<DetallePedido>, IDetallePedidoService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public DetallePedidoService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginacionResultado<PagDetallePedidoCompra>> PagDetallePedidoVerificarCompra(int IdPedido)
    {
        var query = _context.DetallePedidos.Include(x => x.IdPresentacionNavigation).Include(x => x.IdProductoNavigation).
        Where(x => x.IdPedido == IdPedido && x.IdPedidoNavigation != null);

        var PaginacionResultado = await PaginarAsync(query, 1, 1, x => x.IdPedidoNavigation.Estado == "En espera");

        return MapearPaginador.MapearPaginacion<DetallePedido, PagDetallePedidoCompra>(PaginacionResultado,_mapper);
    }
}
