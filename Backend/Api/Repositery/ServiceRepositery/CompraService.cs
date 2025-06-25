using System;
using System.Runtime.CompilerServices;
using Api.Dto;
using Api.Dto.ComprasDtos;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using AutoMapper;

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

    public Task<ResultNoValue> BajaCompra(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<CompraDto>> CrearCompra(CrearCompraDto CrearCompra)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var CompraCreada = await create(_mapper.Map<Compra>(CrearCompra));
        
        if (CompraCreada.Failed)
            return Result<CompraDto>.Fail(CompraCreada.Error, CompraCreada.status);

        var Pedido = await _context.Pedidos.FindAsync(CompraCreada.Value.IdPedido);

        if (Pedido == null)
        {
            await transaction.RollbackAsync();
            return Result<CompraDto>.Fail($"El pedido referenciado con ID:{CompraCreada.Value.IdPedido}");
        }

        Pedido.Estado = "Recibido";

        if (CompraCreada.Success)
        {
            try
            {
                foreach (var detalle in CompraCreada.Value.DetalleCompras)
                {
                    var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);
                    if (presentacion == null)
                    {
                        await transaction.RollbackAsync();
                        return Result<CompraDto>.Fail($"Presentación con ID {detalle.IdPresentacion} no encontrada", Status.NotFound);
                    }

                    presentacion.Inventario += detalle.Cantidad;

                }
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<CompraDto>.Fail($"Error al crear la compra: {ex.Message}");
            }
        }

        return Result<CompraDto>.Ok(_mapper.Map<CompraDto>(CompraCreada.Value));
    }

    public Task<PaginacionResultado<CompraDto>> PaginarCompra(int pagina, int tamanioPagina)
    {
        throw new NotImplementedException();
    }
}