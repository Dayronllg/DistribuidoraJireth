using System;

namespace Api.Dto.ProductosDto;

public class ActualizarProductoDto
{
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int IdMarca { get; set; }

}
