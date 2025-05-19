using System;
using System.Reflection;
using Api.Dto.ProductosDto;
using Api.Models;

namespace Api.Validaciones.IValidationsService;

public interface IValidationProduct
{
    Task<Result<ProductoDto>> ProductoExiste(ProductoDto producto);

}
