using System;
using System.Collections.Immutable;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Transactions;
using Api.Dto;
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
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {

            await dbset.AddAsync(entity);
            await transaction.CommitAsync();
            await Save();
            return Result<T>.Ok(entity);
        }
        catch (Exception e)
        {

            return Result<T>.Fail(e.Message);
        }
    }

    public async Task<PaginacionResultado<T>> PaginarAsync(IQueryable<T> query, int pagina, int tamanioPagina)
    {
        if (pagina < 1) pagina = 1;
        if (tamanioPagina < 1) tamanioPagina = 10;

        var totalRegistros = await query.CountAsync();
        var totalPaginas = (int)Math.Ceiling(totalRegistros / (double)tamanioPagina);

        var datos = await query
            .Skip((pagina - 1) * tamanioPagina)
            .Take(tamanioPagina)
            .ToListAsync();

        return new PaginacionResultado<T>
        {
            Datos = datos,
            PaginaActual = pagina,
            TotalPaginas = totalPaginas,
            TotalRegistros = totalRegistros,
            TamanioPagina = tamanioPagina
        };
    }


    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }

}
