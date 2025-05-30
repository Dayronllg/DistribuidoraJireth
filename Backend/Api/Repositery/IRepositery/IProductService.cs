using System;
using Api.Dto.ProductosDto;
using Api.Models;
using Api.Validaciones;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace Api.Repositery.IRepositery;

public interface IProductService : IService<Producto>
{
    Task<Result<ProductoDto>> Actualizar();
    Task<Result<ProductoDto>> CrearProducto(ProductoDto producto);

}
