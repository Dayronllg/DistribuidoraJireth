using System;
using System.Runtime.CompilerServices;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}
