using System;
using Api.Dto.PedidosDto.DetalleDePedidoDto;

namespace Api.Dto.PedidosDto;

public class ActualizarPedidoDto
{
     public int IdPedido { get; set; }

    public DateOnly FechaPedido { get; set; }

    public string? Ruc { get; set; }

    public string Estado { get; set; } = null!;

    public int IdUsuario { get; set; }

    public virtual ICollection<ActualizarDetallePedidoDto> DetallePedidos { get; set; } = new List<ActualizarDetallePedidoDto>();


}
