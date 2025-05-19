using System;
using Api.Dto.ProductosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Api.Validaciones.IValidationsService;
using AutoMapper;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace Api.Repositery.ServiceRepositery;

public class Product_service : Service<Producto>, IProductService
{
    private readonly DistribuidoraContext _context;
    private readonly IValidationProduct _validation;
    private readonly IMapper _mapper;

    public Product_service(DistribuidoraContext context, IValidationProduct validation,IMapper mapper) : base(context)
    {
        _context = context;
        _validation = validation;
        _mapper = mapper;
    }

    public Task<Result<ProductoDto>> Actualizar()
    {
        throw new NotImplementedException();
    }

    public async Task<Result<ProductoDto>> CrearProducto(ProductoDto producto)
    {
        var Producto = _mapper.Map<Producto>(producto);
        var ValidationResult = await _validation.ProductoExiste(producto);

        if (ValidationResult.Failed)
        {
            return ValidationResult;
        }

        await base.create(Producto);

        return ValidationResult;
         
    }

}

