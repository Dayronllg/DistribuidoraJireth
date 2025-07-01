using System;
using Api.Dto;
using Api.Dto.ComprasDtos.DetallesComprasDtos;
using Api.Models;
using Api.Repositery.IRepositery;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery.ServiceRepositery;

public class DetalleCompraService : Service<DetalleCompra>, IDetalleCompraService
{
    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public DetalleCompraService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

  

    public async Task<PaginacionResultado<PagDetalleCompra>> PaginarDetalleCompra(int id)
    {
        var query = _context.DetalleCompras.Include(x => x.IdPresentacionNavigation).Include(x => x.IdProductoNavigation).
        Where(x => x.IdCompra == id).AsQueryable();

        var PaginacionResultado = await PaginarAsync(query, 1, 1000, x => x.IdCompraNavigation.Estado == "Realizada");

        return MapearPaginador.MapearPaginacion<DetalleCompra, PagDetalleCompra>(PaginacionResultado,_mapper);
    }
}
