using System;
using Api.Dto.MarcasDto;

namespace Api.Dto.ProductosDto;

public class ProductoDto
{
 public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int IdMarca { get; set; }

    public  MarcaDto IdMarcaNavigation { get; set; } = null!;
}
