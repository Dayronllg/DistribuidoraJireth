using System;
using Api.Dto.UsuariosDto;
using Api.Models;
using AutoMapper;

namespace Api;

public class MapConfig:Profile
{
    public MapConfig()
    {
        CreateMap<Usuario, UsuarioCreateDto>().ReverseMap();
        CreateMap<Usuario, UsuarioDto>().ReverseMap(); 
        
    }
}
