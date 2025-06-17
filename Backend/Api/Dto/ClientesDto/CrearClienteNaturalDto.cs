using System;
using Api.Models;

namespace Api.Dto.ClientesDto;

public class CrearClienteNaturalDto
{
    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public required ClienteNatDto ClienteNatural { get; set; }

}
