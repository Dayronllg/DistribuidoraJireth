using System;

namespace Api.Dto.PedidosDto.DetalleDePedidoDto;

public class ActualizarDetallePedidoDto
{

    public int CantidadProducto { get; set; }

    public string Estado { get; set; } = null!;

    public int IdPedido { get; set; }

    public int IdProducto { get; set; }

    public int IdPresentacion { get; set; }
}
