using System;
using Api.Dto.MarcasDto;
using Api.Dto.PresentacionesDto;

namespace Api.Dto.ProductosDto;

public class PaginarProductoDto
{
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public int IdMarca { get; set; }

    public MarcaDto IdMarcaNavigation { get; set; } = null!;
    
    public  ICollection<PresentacionDto> Presentaciones { get; set; } = new List<PresentacionDto>();
}
