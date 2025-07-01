using System;
using System.Runtime.CompilerServices;
using Api.Dto;
using Api.Dto.ComprasDtos;
using Api.Dto.ComprasDtos.DetallesComprasDtos;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Api.Repositery.ServiceRepositery;

public class CompraService : Service<Compra>, ICompraService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;


    public CompraService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public Task<Result<CompraDto>> ActualizarCompra(CompraDto ActualizarCompra)
    {
        throw new NotImplementedException();
    }

   public async Task<ResultNoValue> BajaCompra(int id)
{
    await using var transaction = await _context.Database.BeginTransactionAsync();
        if (transaction == null)
            return ResultNoValue.Fail("error");
        try
            {
                var compraExiste = await _context.Compras
                    .Include(c => c.DetalleCompras) // Incluimos los detalles de la compra
                    .FirstOrDefaultAsync(c => c.IdCompra == id);

                if (compraExiste == null)
                    return ResultNoValue.Fail("La compra no existe", Status.NotFound);

                var pedidoAsociado = await _context.Pedidos.FindAsync(compraExiste.IdPedido);
                if (pedidoAsociado == null)
                    return ResultNoValue.Fail("El pedido asociado no existe");

                // Actualizar estado de la compra y el pedido
                compraExiste.Estado = "Cancelado";
                pedidoAsociado.Estado = "En espera";

                // Revertir el inventario de las presentaciones
                foreach (var detalle in compraExiste.DetalleCompras)
                {
                    var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);
                    if (presentacion == null)
                    {
                        await transaction.RollbackAsync();
                        return ResultNoValue.Fail($"No se encontró la presentación con ID {detalle.IdPresentacion}");
                    }

                    // Restar la cantidad al inventario
                    presentacion.Inventario -= detalle.Cantidad;

                    // Si quieres, puedes validar que el stock no quede negativo
                    if (presentacion.Inventario < 0)
                    {
                        await transaction.RollbackAsync();
                        return ResultNoValue.Fail($"El stock de la presentación con ID {detalle.IdPresentacion} quedaría negativo al cancelar");
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ResultNoValue.Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ResultNoValue.Fail($"Error al cancelar la compra: {ex.Message}");
            }
          }
    public async Task<Result<CompraDto>> CrearCompra(CrearCompraDto CrearCompra)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        if (transaction == null)
            return Result<CompraDto>.Fail("Error, al registrar la compra",Status.None);
        try
            {
                var compraEntity = _mapper.Map<Compra>(CrearCompra);
                var compraGuardada = await _context.Compras.AddAsync(compraEntity);

                var pedido = await _context.Pedidos.FindAsync(compraEntity.IdPedido);

                if (pedido == null)
                {
                    await transaction.RollbackAsync();
                    return Result<CompraDto>.Fail($"El pedido referenciado con ID:{compraEntity.IdPedido} no existe");
                }

                foreach (var detalle in compraEntity.DetalleCompras)
                {
                    var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);
                    if (presentacion == null)
                    {
                        await transaction.RollbackAsync();
                        return Result<CompraDto>.Fail($"Presentación con ID {detalle.IdPresentacion} no encontrada", Status.NotFound);
                    }

                    presentacion.Inventario += detalle.Cantidad;

                }

                pedido.Estado = "Recibido";

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Result<CompraDto>.Ok(_mapper.Map<CompraDto>(compraGuardada.Entity));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<CompraDto>.Fail($"Error al crear la compra: {ex.Message}");
            }

       
    }
    

    public async Task<PaginacionResultado<CompraDto>> PaginarCompra(int pagina, int tamanioPagina)
    {
         var query = _context.Compras.AsQueryable();
        var PaginacionPedido = await PaginarAsync(query, pagina, tamanioPagina, x => x.Estado == "Realizada");

        return MapearPaginador.MapearPaginacion<Compra, CompraDto>(PaginacionPedido, _mapper);
    }

}