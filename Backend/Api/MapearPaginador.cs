using System;
using Api.Dto;
using AutoMapper;

namespace Api;

public static class MapearPaginador
{
     public static PaginacionResultado<TDestino> MapearPaginacion<TOrigen, TDestino>(
        PaginacionResultado<TOrigen> origen,
        IMapper mapper) => new PaginacionResultado<TDestino>
        {
            Datos = mapper.Map<List<TDestino>>(origen.Datos),
            PaginaActual = origen.PaginaActual,
            TotalPaginas = origen.TotalPaginas,
            TotalRegistros = origen.TotalRegistros,
            TamanioPagina = origen.TamanioPagina
        };
}


