using System;
using System.Data;
using Api.Dto;
using Api.Dto.VentasDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class VentaService : Service<Venta>, IVentaService
{

    private readonly DistribuidoraContext _context;
    private readonly IMapper _mapper;

    public VentaService(DistribuidoraContext context, IMapper mapper):base(context)
    {
        _context = context;
        _mapper = mapper;
    }

    public Task<Result<VentaDto>> ActualizarVenta(VentaDto ActualizarVenta)
    {
        throw new NotImplementedException();
    }

    public Task<ResultNoValue> BajaVenta(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<VentaDto>> CrearVenta(CrearVentaDto CrearVenta)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
          try

            {
                // Mapear y agregar la venta (SIN SAVE aún)
                var ventaEntity = _mapper.Map<Venta>(CrearVenta);
                await _context.Ventas.AddAsync(ventaEntity);
                
                // Aquí ya tienes la venta en memoria, pero no guardada

            foreach (var detalle in ventaEntity.DetalleVenta)
            {
                var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);

                if (presentacion == null)
                {
                    await transaction.RollbackAsync();
                    return Result<VentaDto>.Fail($"Presentación con ID {detalle.IdPresentacion} no encontrada", Status.NotFound);
                }

                if (presentacion.Inventario < detalle.Cantidad)
                {
                    await transaction.RollbackAsync();
                    return Result<VentaDto>.Fail($"Inventario insuficiente para la presentación {presentacion.Nombre}", Status.Conflict);
                }

                presentacion.Inventario -= detalle.Cantidad;

            }

                // Guardar TODO JUNTO
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Result<VentaDto>.Ok(_mapper.Map<VentaDto>(ventaEntity));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<VentaDto>.Fail($"Error al crear la venta: {ex.Message}");
            }
    }

    public async Task<PaginacionResultado<VentaDto>> PaginarVenta(int pagina, int tamanioPagina)
    {

         var query = _context.Ventas.AsQueryable();
        var PaginacionVenta = await PaginarAsync(query, pagina,tamanioPagina ,x => x.DetalleVenta != null );

        return MapearPaginador.MapearPaginacion<Venta, VentaDto>(PaginacionVenta,_mapper);
    }
}
