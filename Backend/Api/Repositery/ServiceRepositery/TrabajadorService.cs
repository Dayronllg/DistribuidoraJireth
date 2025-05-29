using System;
using Api.Dto;
using Api.Dto.TrabajadorDtos;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones;
using AutoMapper;

namespace Api.Repositery.ServiceRepositery;

public class TrabajadorService : Service<Trabajadore>, ITrabajador
{
    private readonly DistribuidoraContext _Context;
    private readonly IMapper _mapper;

    public TrabajadorService(DistribuidoraContext context, IMapper mapper) : base(context)
    {
        _Context = context;
        _mapper = mapper;
    }

    public async Task<Result<CrearTrabajadorDto>> CrearTrabajador(CrearTrabajadorDto CrearTrabajador)
    {
        var MapTrabajador = _mapper.Map<Trabajadore>(CrearTrabajador);
        var result = await base.create(MapTrabajador);

        return Result<CrearTrabajadorDto>.Ok(CrearTrabajador);
        
    }

    public Task<PaginacionResultado<Trabajadore>> PaginarAsync(IQueryable<Trabajadore> query, int pagina, int tamanioPagina)
    {
        throw new NotImplementedException();
    }
}
