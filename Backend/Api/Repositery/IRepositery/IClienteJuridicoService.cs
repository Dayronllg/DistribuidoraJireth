using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Models;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IClienteJuridicoService : IService<Cliente>
{
  Task<Result<ClienteJuridicoDto>> CrearClienteJuridico(CrearClienteJuridicoDto crearClienteJuridico);

  Task<PaginacionResultado<ClienteJuridicoDto>> ObtenerClientesJuridicos(int pagina, int tamanio);

  Task<ResultNoValue> BajaClienteJuridico(string id);

  Task<Result<ClienteJuridicoDto>> ActualizarClienteJuridico(ClienteJuridicoDto ActClienteJuridico);

}
