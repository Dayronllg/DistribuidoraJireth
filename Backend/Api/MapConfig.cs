using System;
using Api.Dto;
using Api.Dto.ClientesDto;
using Api.Dto.ComprasDtos;
using Api.Dto.ComprasDtos.DetallesComprasDtos;
using Api.Dto.MarcasDto;
using Api.Dto.PedidosDto;
using Api.Dto.PedidosDto.DetalleDePedidoDto;
using Api.Dto.PresentacionesDto;
using Api.Dto.ProductosDto;
using Api.Dto.ProveedoresDto;
using Api.Dto.RolesDto;
using Api.Dto.TrabajadorDtos;
using Api.Dto.UsuariosDto;
using Api.Dto.VentasDto;
using Api.Dto.VentasDto.DetalleVentaDto;
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
        CreateMap<ProductoDto, Producto>().ForMember(dest => dest.IdMarcaNavigation, opt => opt.MapFrom(src => src.IdMarcaNavigation)).ReverseMap();
        CreateMap<PaginarProductoDto, Producto>().ForMember(dest => dest.IdMarcaNavigation, opt => opt.MapFrom(src => src.IdMarcaNavigation)).
        ForMember(dest => dest.Presentaciones, opt => opt.MapFrom(src => src.Presentaciones)).ReverseMap();
        CreateMap<Producto, CrearProductoDto>().ReverseMap();
        CreateMap<Producto, ActualizarProductoDto>().ReverseMap();
        //Mapeo trabajador
        CreateMap<Trabajadore, CrearTrabajadorDto>().ReverseMap();
        CreateMap<PaginarTrabajadorDto, Trabajadore>().ReverseMap();
        CreateMap<ActualizarTrabajadorDto, Trabajadore>().ReverseMap();
        CreateMap<TrabajadorDto, Trabajadore>().ReverseMap();
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
        //Mapeo Presentaciones
        CreateMap<Presentacione, PresentacionDto>().ReverseMap();
        CreateMap<Presentacione, CrearPresentacionDto>().ReverseMap();
        CreateMap<Presentacione, ActualizarPresentacionDto>().ReverseMap();
        //MapeoPedidos
        CreateMap<CrearDetallePedidoDto, DetallePedido>().ReverseMap();
        CreateMap<DetallePedidoDto, DetallePedido>().ReverseMap();
        CreateMap<CrearPedidoDto, Pedido>().ForMember(dest => dest.DetallePedidos, opt => opt.MapFrom(src => src.DetallePedidos)).ReverseMap();
        CreateMap<Pedido, PedidoDto>().ReverseMap();
        CreateMap<PagDetallePedidoCompra, DetallePedido>().ForMember(dest => dest.IdProductoNavigation, opt => opt.MapFrom(src => src.IdProductoNavigation)).
        ForMember(src => src.IdPresentacionNavigation, opt => opt.MapFrom(src => src.IdPresentacionNavigation)).ReverseMap();
        //MapeoVentas
        CreateMap<CrearDetalleVentaDto, DetalleVenta>().ReverseMap();
        CreateMap<DetalleVentaDto, DetalleVenta>().ReverseMap();
        CreateMap<CrearVentaDto, Venta>().ForMember(dest => dest.DetalleVenta, opt => opt.MapFrom(src => src.DetalleVenta)).ReverseMap();
        CreateMap<Venta, VentaDto>().ReverseMap();
        //MapeoCompras
        CreateMap<CrearDetalleCompraDto, DetalleCompra>().ReverseMap();
        CreateMap<DetalleCompraDto, DetalleCompra>().ReverseMap();
        CreateMap<CrearCompraDto, Compra>().ForMember(dest => dest.DetalleCompras, opt => opt.MapFrom(src => src.DetalleCompras)).ReverseMap();
        CreateMap<Compra, CompraDto>().ReverseMap();
    
    }
}
