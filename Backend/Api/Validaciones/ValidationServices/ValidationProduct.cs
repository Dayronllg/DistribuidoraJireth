using System;
using Api.Dto.ProductosDto;
using Api.Models;
using Api.Validaciones.IValidationsService;
using Microsoft.EntityFrameworkCore;

namespace Api.Validaciones.ValidationServices;

public class ValidationProduct : IValidationProduct
{
    private readonly DistribuidoraContext _context;

    public ValidationProduct(DistribuidoraContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductoDto>> ProductoExiste(ProductoDto producto)
    {
        if (await _context.Productos.AnyAsync(x => x.Nombre.ToLower() == producto.Nombre.ToLower()))
        {
            return Result<ProductoDto>.Fail("El Producto Ya existe");
        }

        return Result<ProductoDto>.Ok(producto);
    }
}
