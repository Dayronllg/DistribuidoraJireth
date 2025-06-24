using System;
using Api.Dto;
using Api.Dto.VentasDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IVentaService:IService<Venta>
{
    Task<Result<VentaDto>> CrearVenta(CrearVentaDto CrearVenta);
    Task<PaginacionResultado<VentaDto>> PaginarVenta(int pagina, int tamanioPagina);
    Task<ResultNoValue> BajaVenta(int id);
    Task<Result<VentaDto>> ActualizarVenta(VentaDto ActualizarVenta);

}
