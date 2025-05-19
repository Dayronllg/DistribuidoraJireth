using System;
using Api.Dto.ProductosDto;
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
        
    }
}
