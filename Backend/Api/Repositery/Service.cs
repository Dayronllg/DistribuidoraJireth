using System;
using System.Collections.Immutable;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Api.Repositery;

public class Service<T> : IService<T> where T : class
{

    private readonly DistribuidoraContext _context;
    internal DbSet<T> dbset;

    public Service(DistribuidoraContext context)
    {
        _context = context;
        this.dbset = context.Set<T>();
    }

    public virtual async Task<Result<T>> create(T entity)
    {
        await dbset.AddAsync(entity);
        await Save();

        return Result<T>.Ok(entity);
    }

    public Task<Result<List<T>>> GetAll()
    {
        throw new NotImplementedException();
    }

    /* public async Task<Result<List<T>>> GetAll(Expression<Func<T,bool>>? func=null)
     {
         IQueryable<T> query = dbset;
         if (func != null)
         {
             List<T> list = await query.ToListAsync();

             return Result<List<T>>.Ok(list);
         }
     }
 //*/
    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}
