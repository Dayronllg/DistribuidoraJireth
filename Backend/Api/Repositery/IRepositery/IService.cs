using System;
using Api.Dto;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IService<T> where T : class
{
    Task<Result<T>> create(T entity);
    Task Save();

    Task<PaginacionResultado<T>> PaginarAsync( IQueryable<T> query, int pagina,  int tamanioPagina);

}
