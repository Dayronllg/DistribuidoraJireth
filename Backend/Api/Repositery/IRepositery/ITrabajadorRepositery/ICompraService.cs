using System;
using Api.Dto;
using Api.Dto.ComprasDtos;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery.ITrabajadorRepositery;

public interface ICompraService:IService<Compra>
{
  Task<Result<CompraDto>> CrearCompra(CrearCompraDto CrearCompra);
    Task<PaginacionResultado<CompraDto>> PaginarCompra(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaCompra(int id);
    Task<Result<CompraDto>> ActualizarCompra(CompraDto ActualizarCompra);
}
