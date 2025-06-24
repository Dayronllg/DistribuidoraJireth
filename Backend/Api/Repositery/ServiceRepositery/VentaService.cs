using System;
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
        var VentaCreada = await create(_mapper.Map<Venta>(CrearVenta));

        if (VentaCreada.Failed)
            return Result<VentaDto>.Fail(VentaCreada.Error, VentaCreada.status);

        if (VentaCreada.Success)
    {
        foreach (var detalle in VentaCreada.Value.DetalleVenta)
        {
            var presentacion = await _context.Presentaciones.FindAsync(detalle.IdPresentacion);
            if (presentacion == null)
            {
                return Result<VentaDto>.Fail($"Presentación con ID {detalle.IdPresentacion} no encontrada",Status.NotFound);
            }

            if (presentacion.Inventario < detalle.Cantidad)
            {
                return Result<VentaDto>.Fail($"Inventario insuficiente para la presentación {presentacion.Nombre}",Status.Conflict);
            }

            presentacion.Inventario -= detalle.Cantidad;
        }

        await _context.SaveChangesAsync(); 
    }
        return Result<VentaDto>.Ok(_mapper.Map<VentaDto>(VentaCreada.Value)); 
    }

    public Task<PaginacionResultado<VentaDto>> PaginarVenta(int pagina, int tamanioPagina)
    {
        throw new NotImplementedException();
    }
}
