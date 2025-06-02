using System;
using Api.Dto;
using Api.Dto.ProductosDto;
using Api.Dto.RolesDto;
using Api.Dto.TrabajadorDtos;
using Api.Dto.UsuariosDto;
using Api.Models;
using AutoMapper;

namespace Api;

public class MapConfig:Profile
{
    public MapConfig()
    {
        //Mapeo Usuario
        CreateMap<Usuario, UsuarioCreateDto>().ReverseMap();
        CreateMap<Usuario, UsuarioDto>().ReverseMap();
        //Mapeo Producto
        CreateMap<Producto, ProductoDto>().ReverseMap();
        //Mapeo trabajador
        CreateMap<Trabajadore, CrearTrabajadorDto>().ReverseMap();
        CreateMap<PaginarTrabajadorDto, Trabajadore>().ReverseMap();
        //MapeoRol
        CreateMap<Role, RolDto>().ReverseMap();
        
    }
}
