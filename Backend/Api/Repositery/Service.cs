using System;
using System.Collections.Immutable;
using System.Linq.Expressions;
using Api.Dto;
using Api.Models;
using Api.Repositery.IRepositery;
using Api.Validaciones;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;


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
        if (_context.Database.CurrentTransaction == null)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                await dbset.AddAsync(entity);
                await Save();
                await transaction.CommitAsync();
                return Result<T>.Ok(entity);
            }
            catch (Exception e)
            {
                if (transaction.GetDbTransaction().Connection != null)
                {
                    await transaction.RollbackAsync();
                }
                return Result<T>.Fail(e.Message);
            }
        }


        try
        {
            await dbset.AddAsync(entity);
            await Save();
            return Result<T>.Ok(entity);
        }
        catch (Exception e)
        {
            
            return Result<T>.Fail(e.Message);
        }
    }


    public async Task<Result<T>> Exists(Expression<Func<T, bool>> func)
    {
        var EntityExist = await dbset.FirstOrDefaultAsync(func);

        if (EntityExist == null)
            return Result<T>.Fail("El registro no existe", Status.NotFound);

        return Result<T>.Ok(EntityExist);
    }



    public async Task<PaginacionResultado<T>> PaginarAsync(IQueryable<T> query, int pagina, int tamanioPagina, Expression<Func<T, bool>> func)
    {
        if (pagina < 1) pagina = 1;
        if (tamanioPagina < 1) tamanioPagina = 10;


        var totalRegistros = await query.Where(func).CountAsync();
        var totalPaginas = (int)Math.Ceiling(totalRegistros / (double)tamanioPagina);



        var datos = await query.Where(func)
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


    public async Task<int> Save()
    {
        int AfectedRows = await _context.SaveChangesAsync();
        return AfectedRows;
    }

    public async Task<Result<T>> UpdateEntity(T entity)
    {
        _context.Update(entity);
        var AfectedRows = await Save();
        if (AfectedRows == 0)
            return Result<T>.Fail("0 registros afectados", Status.WithoutChanges);



        return Result<T>.Ok(entity);
    }


}
