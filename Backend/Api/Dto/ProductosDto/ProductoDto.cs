using System;

namespace Api.Dto.ProductosDto;

public class ProductoDto
{

    public string Nombre { get; set; } = null!;

    public decimal Precio { get; set; }

    public int IdMarca { get; set; }

}
