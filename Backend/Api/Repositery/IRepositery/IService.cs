using System;
using Api.Validaciones;

namespace Api.Repositery.IRepositery;

public interface IService<T> where T : class
{
    Task<Result<T>> create(T entity);
    Task Save();

}
