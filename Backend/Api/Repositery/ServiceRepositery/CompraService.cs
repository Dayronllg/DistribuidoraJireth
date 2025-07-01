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
        return Result<CompraDto>.Fail("Error al iniciar la transacción", Status.None);

    try
    {
        var compraEntity = _mapper.Map<Compra>(CrearCompra);
        await _context.Compras.AddAsync(compraEntity);

        var pedido = await _context.Pedidos
            .Include(p => p.DetallePedidos)
            .FirstOrDefaultAsync(p => p.IdPedido == compraEntity.IdPedido);

        if (pedido == null)
        {
            await transaction.RollbackAsync();
            return Result<CompraDto>.Fail($"El pedido con ID {compraEntity.IdPedido} no existe", Status.NotFound);
        }

        foreach (var detalle in compraEntity.DetalleCompras)
        {
            // Buscar el detalle del pedido correspondiente
            var detallePedido = pedido.DetallePedidos.FirstOrDefault(dp =>
                dp.IdProducto == detalle.IdProducto &&
                dp.IdPresentacion == detalle.IdPresentacion);

            if (detallePedido == null)
            {
                await transaction.RollbackAsync();
                return Result<CompraDto>.Fail($"No existe detalle de pedido para Producto ID {detalle.IdProducto} y Presentación ID {detalle.IdPresentacion}", Status.NotFound);
            }

            // Validar que la cantidad comprada no supere la del pedido
            if (detalle.Cantidad > detallePedido.CantidadProducto)
            {
                await transaction.RollbackAsync();
                return Result<CompraDto>.Fail(
                    $"Cantidad de compra para Producto ID {detalle.IdProducto} / Presentación ID {detalle.IdPresentacion} excede la solicitada en el pedido. Pedido: {detallePedido.CantidadProducto}, Intentado: {detalle.Cantidad}");
            }

            // Actualizar inventario
            var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);
            if (presentacion == null)
            {
                await transaction.RollbackAsync();
                return Result<CompraDto>.Fail($"Presentación con ID {detalle.IdPresentacion} no encontrada", Status.NotFound);
            }

            presentacion.Inventario += detalle.Cantidad;
        }

        // Cambiar estado del pedido (opcional, según tu lógica)
        pedido.Estado = "Recibido";

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Result<CompraDto>.Ok(_mapper.Map<CompraDto>(compraEntity));
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