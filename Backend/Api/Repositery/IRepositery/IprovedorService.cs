using System;
using Api.Dto;
using Api.Dto.ProveedoresDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IProvedorService : IService<Proveedore>
{

  Task<Result<ProveedorDto>> CrearProvedor(CrearProveedorDto crearProveedor);

  Task<PaginacionResultado<ProveedorDto>> ObtenerProvedores(int pagina, int tamanio);

  Task<ResultNoValue> BajaProveedor(string id);

  Task<Result<ProveedorDto>> ActualizarProveedor(ProveedorDto ActProveedor);
}
