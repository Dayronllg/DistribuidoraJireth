using System;
using Api.Dto;
using Api.Dto.PedidosDto;
using Api.Dto.PedidosDto.DetalleDePedidoDto;

namespace Api.Repositery.IRepositery;

public interface IDetallePedidoService
{
    Task<PaginacionResultado<PagDetallePedidoCompra>> PagDetallePedidoVerificarCompra(int IdPedido);
}
