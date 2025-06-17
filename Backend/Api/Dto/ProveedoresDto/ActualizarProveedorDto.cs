using System;

namespace Api.Dto.ProveedoresDto;

public class ActualizarProveedorDto
{
    public string Ruc { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Direccion { get; set; } = null!;
}
