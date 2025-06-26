using System;
using Api.Dto;
using Api.Dto.ProductosDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Api.Validaciones.IValidationsService;
using AutoMapper;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.EntityFrameworkCore;
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

    public async Task<Result<ProductoDto>> ActualizarProducto(ActualizarProductoDto ActualizarProducto)
    {
        var ProductoRespuesta = await base.Exists(x => x.IdProducto == ActualizarProducto.IdProducto
                                        && x.Estado == "Activo");

        if (ProductoRespuesta.Failed)
            return Result<ProductoDto>.Fail(ProductoRespuesta.Error, ProductoRespuesta.status);

        _mapper.Map(ActualizarProducto,ProductoRespuesta.Value);

        var SuccessUpdated = await base.UpdateEntity( _mapper.Map(ActualizarProducto,ProductoRespuesta.Value));

        if (SuccessUpdated.Failed)
            return Result<ProductoDto>.Fail(SuccessUpdated.Error, SuccessUpdated.status);

         var productoConMarca = await _context.Productos
        .Include(p => p.IdMarcaNavigation)
        .FirstOrDefaultAsync(p => p.IdProducto==SuccessUpdated.Value.IdProducto);


        return Result<ProductoDto>.Ok(_mapper.Map<ProductoDto>(productoConMarca));
    }

    public async Task<ResultNoValue> BajaProducto(int id)
    {
         var entity = await base.Exists(x => x.IdProducto == id && x.Estado == "Activo");
        if (entity.Failed)
            return ResultNoValue.Fail(entity.Error,Status.NotFound);
            
        entity.Value.Estado = "Inactivo";
        
       var SuccessUpdated= await base.UpdateEntity(entity.Value);

        if (SuccessUpdated.Failed)
            return ResultNoValue.Fail(SuccessUpdated.Error, Status.WithoutChanges);

        return ResultNoValue.Ok();
    }

    public async Task<Result<ProductoDto>> CrearProducto(CrearProductoDto producto)
    {
        var Producto = _mapper.Map<Producto>(producto);
        var ValidationResult = await _validation.ProductoExiste(producto);

        if (ValidationResult.Failed)
        {
            return Result<ProductoDto>.Fail(ValidationResult.Error,ValidationResult.status);
        }

        var productoCreado = await base.create(Producto);

        return Result<ProductoDto>.Ok(_mapper.Map<ProductoDto>(productoCreado.Value));
         
    }

    
    public async Task<PaginacionResultado<PaginarProductoDto>> PaginarProducto(int pagina, int tamanioPagina)
    {
        var query = _context.Productos.Include(x => x.IdMarcaNavigation).Include(x=> x.Presentaciones   );
        var PagTrabajador = await base.PaginarAsync(query, pagina, tamanioPagina, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Producto,PaginarProductoDto >(PagTrabajador,_mapper);
    }


   public async Task<PaginacionResultado<ProductoDto>> PaginarSoloProducto(int pagina, int tamanioPagina)
    {
        var query = _context.Productos.Include(x=>x.IdMarcaNavigation).AsQueryable();
        var PagTrabajador = await base.PaginarAsync(query, pagina, tamanioPagina, x=>x.Estado=="Activo");

        return MapearPaginador.MapearPaginacion<Producto,ProductoDto >(PagTrabajador,_mapper);
    }
}

