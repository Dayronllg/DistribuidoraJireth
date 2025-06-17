using System;
using Api.Models;

namespace Api.Dto.ClientesDto;

public class CrearClienteJuridicoDto
{
    

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public required ClienteJurDto ClienteJuridico { get; set; }

}
