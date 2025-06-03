using System;

namespace Api.Dto.ProductosDto;

public class CrearProductoDto
{

    public string Nombre { get; set; } = null!;

    public decimal Precio { get; set; }

    public int Cantidad { get; set; }


    public int IdMarca { get; set; }

}
