using System;

namespace Api.Dto.TrabajadorDtos;

public class TrabajadorDto
{
  public int IdTrabajador { get; set; }
  public string PrimerNombre { get; set; } = null!;

  public string? SegundoNombre { get; set; }

  public string PrimerApellido { get; set; } = null!;

  public string? SegundoApellido { get; set; }

  public string Telefono { get; set; } = null!;
    
   public string Estado { get; set; } = null!;
}
