using System;
using Api.Models;

namespace Api.Dto.ClientesDto;

public class ClienteJuridicoDto
{
    public int IdCliente { get; set; }

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public required ClienteJurDto ClienteJuridico { get; set; }

   
}
