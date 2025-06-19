using System;

namespace Api.Dto.PresentacionesDto;

public class CrearPresentacionDto
{
    public string Nombre { get; set; } = null!;

    public decimal Precio { get; set; }

    public int Inventario { get; set; }

    public string UnidadDeMedida { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int IdProductos { get; set; }
  
}
