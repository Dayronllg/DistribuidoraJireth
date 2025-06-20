using System;
using Api.Dto.PedidosDto.DetalleDePedidoDto;

namespace Api.Dto.PedidosDto;

public class CrearPedidoDto
{


    public DateOnly FechaPedido = DateOnly.FromDateTime(DateTime.Now);

    public string? Ruc { get; set; }

    public string Estado { get; set; } = null!;

    public int IdUsuario { get; set; }

    public virtual ICollection<CrearDetallePedidoDto> DetallePedidos { get; set; } = new List<CrearDetallePedidoDto>();

}
