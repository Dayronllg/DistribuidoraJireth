using System;
using Api.Dto.RepotesDto.ReporteDeVentasDto;
using Api.Dto.VentasDto.DetalleVentaDto;
using Api.Models;
using Api.Repositery.IRepositery;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositery.ServiceRepositery;

public class ReporteService : Service<Venta>,IReporteService
{
    private readonly DistribuidoraContext _context;
    public ReporteService(DistribuidoraContext context) : base(context)
    {
        _context = context;
    }

    public async Task<ReporteDeVentsDto> CrearReporteDeVentas(FiltroFechaInicioYFinDto filtroFecha)
    {
        var ventas = await _context.Ventas
        .Include(v => v.IdClienteNavigation)
        .Where(v => v.Fecha >= filtroFecha.FechaInicio && v.Fecha <= filtroFecha.FechaFin)
        .ToListAsync();

    var totalVentas = ventas.Count;
    var totalMonto = ventas.Sum(v => v.TotalVenta);
    var promedio = totalVentas > 0 ? totalMonto / totalVentas : 0;
    var ventaMaxima = totalVentas > 0 ? ventas.Max(v => v.TotalVenta) : 0;
    var ventaMinima = totalVentas > 0 ? ventas.Min(v => v.TotalVenta) : 0;
    var clientesUnicos = ventas.Select(v => v.IdCliente).Distinct().Count();

    var ventasPorDia = ventas
        .GroupBy(v => v.Fecha)
        .Select(g => new VentasPorDiaDto
        {
            Fecha = g.Key,
            CantidadVentas = g.Count(),
            MontoTotal = g.Sum(v => v.TotalVenta)
        })
        .OrderBy(v => v.Fecha)
        .ToList();
    
    var detalles = await _context.DetalleVentas
    .Include(d => d.IdVentaNavigation)
        .ThenInclude(v => v.IdClienteNavigation)
            .ThenInclude(c => c.ClienteNatural)
    .Include(d => d.IdVentaNavigation)
        .ThenInclude(v => v.IdClienteNavigation)
            .ThenInclude(c => c.ClienteJuridico)
    .Include(d => d.IdProductoNavigation)
    .Include(d => d.IdPresentacionNavigation)
    .Where(d => d.IdVentaNavigation.Fecha >= filtroFecha.FechaInicio && d.IdVentaNavigation.Fecha <= filtroFecha.FechaFin)
    .Select(d => new DetalleVentasReportesDto
    {
        IdVenta = d.IdVenta,
        FechaVenta = d.IdVentaNavigation.Fecha,
        
        ClienteNombre = 
            d.IdVentaNavigation.IdClienteNavigation.ClienteNatural != null
            ? d.IdVentaNavigation.IdClienteNavigation.ClienteNatural.PrimerNombre
            : d.IdVentaNavigation.IdClienteNavigation.ClienteJuridico!.Nombre,

        ProductoNombre = d.IdProductoNavigation.Nombre,
        PresentacionNombre = d.IdPresentacionNavigation.Nombre,
        Cantidad = d.Cantidad,
        PrecioUnitario = d.Precio,
        Subtotal = d.Subtotal
    })
    .ToListAsync();

    return new ReporteDeVentsDto
        {
            TotalVentas = totalVentas,
            TotalMonto = totalMonto,
            MontoPromedioPorVenta = promedio,
            VentaMaxima = ventaMaxima,
            VentaMinima = ventaMinima,
            TotalClientesUnicos = clientesUnicos,
            VentasPorDia = ventasPorDia,
            Detalles = detalles
        };
    }
}

