using System;

namespace Api.Dto.ProveedoresDto;

public class ProveedorDto
{
    public string Ruc { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string? Estado { get; set; }

}
