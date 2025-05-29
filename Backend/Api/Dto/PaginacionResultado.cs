using System;

namespace Api.Dto;

public class PaginacionResultado<T>
{
    public List<T> Datos { get; set; } = new();
    public int PaginaActual { get; set; }
    public int TotalPaginas { get; set; }
    public int TotalRegistros { get; set; }
    public int TamanioPagina { get; set; }
}

