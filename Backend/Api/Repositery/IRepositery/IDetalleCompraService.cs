using System;
using Api.Dto;
using Api.Dto.ComprasDtos.DetallesComprasDtos;

namespace Api.Repositery.IRepositery;

public interface IDetalleCompraService
{
    Task<PaginacionResultado<PagDetalleCompra>> PaginarDetalleCompra(int id);
}
