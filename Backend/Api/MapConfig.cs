using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Dto.ClientesDto;
using Api.Dto.MarcasDto;
using Api.Dto.ProductosDto;
using Api.Dto.ProveedoresDto;
using Api.Dto.ProveedoresDto;
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
        CreateMap<ActualizarTrabajadorDto, Trabajadore>().ReverseMap();
        //MapeoRol
        CreateMap<Role, RolDto>().ReverseMap();
        CreateMap<Role, CrearRolDto>().ReverseMap();
        // Mapeo Marca
        CreateMap<CrearMarcaDto, Marca>().ReverseMap();
        CreateMap<MarcaDto, Marca>().ReverseMap();
        //Mapeo Proveedores
        CreateMap<Proveedore, CrearProveedorDto>().ReverseMap();
        CreateMap<Proveedore, ProveedorDto>().ReverseMap();
        //Mapeo ClienteNatural
        CreateMap<Cliente, ClienteNaturalDto>().ReverseMap();
        CreateMap<ClienteNatDto, ClienteNatural>().ReverseMap();
        CreateMap<CrearClienteNaturalDto, Cliente>()
       .ForMember(dest => dest.ClienteNatural, opt => opt.MapFrom(src => src.ClienteNatural)).ReverseMap();
        //Mapeo Cliente juridico
        CreateMap<Cliente, ClienteJuridicoDto>().ReverseMap();
        CreateMap<ClienteJurDto, ClienteJuridico>().ReverseMap();
        CreateMap<CrearClienteJuridicoDto, Cliente>().ForMember(dest => dest.ClienteJuridico, opt => opt.MapFrom(src => src.ClienteJuridico)).ReverseMap();
        CreateMap<ClienteJuridicoDto, ClienteJuridico>()
       .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
         //mapeo marcas
        CreateMap<MarcaDto, Marca>().ReverseMap();
        CreateMap<Marca, MarcaDto>().ReverseMap();
        //Mapeo Proveedores     
        CreateMap<Proveedore, CrearProveedorDto>().ReverseMap();
        CreateMap<Proveedore, ProveedorDto>().ReverseMap();
        //Mapeo ClienteNatural
        CreateMap<Cliente, ClienteNaturalDto>().ReverseMap();
        CreateMap<ClienteNatDto, ClienteNatural>().ReverseMap();
        CreateMap<CrearClienteNaturalDto, Cliente>()
       .ForMember(dest => dest.ClienteNatural, opt => opt.MapFrom(src => src.ClienteNatural)).ReverseMap();
        //Mapeo Cliente juridico
        CreateMap<Cliente, ClienteJuridicoDto>().ReverseMap();
        CreateMap<ClienteJurDto, ClienteJuridico>().ReverseMap();
        CreateMap<CrearClienteJuridicoDto, Cliente>().ForMember(dest => dest.ClienteJuridico, opt => opt.MapFrom(src => src.ClienteJuridico)).ReverseMap();
        CreateMap<ClienteJuridicoDto, ClienteJuridico>()
       .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

       


        
    }
}
