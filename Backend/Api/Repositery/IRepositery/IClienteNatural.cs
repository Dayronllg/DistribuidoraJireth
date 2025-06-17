using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IClienteNatural:IService<Cliente>
{
  Task<Result<ClienteNaturalDto>> CrearClientNatural(CrearClienteNaturalDto crearClienteNatural);

  Task<PaginacionResultado<ClienteNaturalDto>> ObtenerClientesNaturales(int pagina, int tamanio);

  Task<ResultNoValue> BajaClienteNatural(int id);

  Task<Result<ClienteNaturalDto>> ActualizarClienteNatural(ClienteNaturalDto ActClienteNatural);
}
