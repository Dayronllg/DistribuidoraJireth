using System;
using Api.Dto;
using Api.Dto.ProductosDto;
using Api.Models;
using Api.Validaciones;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace Api.Repositery.IRepositery;

public interface IProductService : IService<Producto>
{

    Task<Result<ProductoDto>> CrearProducto(CrearProductoDto producto);

    Task<PaginacionResultado<PaginarProductoDto>> PaginarProducto(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaProducto(int id);
    Task<Result<ProductoDto>> ActualizarProducto(ProductoDto ActualizarProducto);

}
