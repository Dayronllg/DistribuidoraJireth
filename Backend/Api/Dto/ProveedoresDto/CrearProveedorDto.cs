using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Dto.ProveedoresDto;

public class CrearProveedorDto
{
    [MinLength(14, ErrorMessage = "Los numeros Ruc son de 14 caracteres")]
    
    public string Ruc { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Direccion { get; set; } = null!;

}
