using System;
using Api.Dto.PedidosDto.DetalleDePedidoDto;

namespace Api.Dto.PedidosDto;

public class PedidoDto
{
  public int IdPedido { get; set; }

    public DateOnly FechaPedido { get; set; }

    public string? Ruc { get; set; }

    public string Estado { get; set; } = null!;

    public int IdUsuario { get; set; }

}
