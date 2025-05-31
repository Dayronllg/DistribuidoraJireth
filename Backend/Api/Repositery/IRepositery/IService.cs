using System;
using System.Linq.Expressions;
using Api.Dto;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IService<T> where T : class
{
    Task<Result<T>> create(T entity);
    Task<int> Save();
    Task<Result<T>> Exists(Expression<Func<T,bool>> func);
    Task<Result<T>> UpdateEntity(T entity);
    Task<PaginacionResultado<T>> PaginarAsync( IQueryable<T> query, int pagina, int tamanioPagina, Expression<Func<T,bool>> func);

}
