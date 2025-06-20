using System;

namespace Api.Dto.PedidosDto.DetalleDePedidoDto;

public class CrearDetallePedidoDto
{
    

    public int CantidadProducto { get; set; }

    public string Estado { get; set; } = null!;


    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }
}
