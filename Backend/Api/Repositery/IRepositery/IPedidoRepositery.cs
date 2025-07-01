using System;
using Api.Dto;
using Api.Dto.PedidosDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IPedidoRepositery : IService<Pedido>
{
    Task<Result<PedidoDto>> CrearPedido(CrearPedidoDto CrearPedido);
    Task<PaginacionResultado<PedidoDto>> PaginarPedido(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaPedido(int id);
    Task<Result<PedidoDto>> ActualizarPedido(PedidoDto ActualizarPedido);

    Task<PaginacionResultado<PedidoDto>> PaginarTodosPedidos(int pagina, int tamanioPagina);
    
    
}
