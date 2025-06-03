using System;
using Api.Dto.TrabajadorDtos;
using Api.Models;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Validaciones.IValidationsService;

namespace Api.Validaciones.ValidationServices;

public class TrabajadorValidation // : ITrabajadorValidation
{

    private readonly DistribuidoraContext _context;

    public TrabajadorValidation(DistribuidoraContext context)
    {
        _context = context;
    }

  /*  public async Task<Result<Trabajadore>> Validar(CrearTrabajadorDto validarTrabajador)
    {
        
    }*/
}
