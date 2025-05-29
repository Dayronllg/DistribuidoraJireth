using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Api.Models;

public partial class DistribuidoraContext : DbContext
{
    public DistribuidoraContext()
    {
    }

    public DistribuidoraContext(DbContextOptions<DistribuidoraContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<ClienteJuridico> ClienteJuridicos { get; set; }

    public virtual DbSet<ClienteNatural> ClienteNaturals { get; set; }

    public virtual DbSet<Compra> Compras { get; set; }

    public virtual DbSet<DetalleCompra> DetalleCompras { get; set; }

    public virtual DbSet<DetalleDevVentum> DetalleDevVenta { get; set; }

    public virtual DbSet<DetalleDevoCompra> DetalleDevoCompras { get; set; }

    public virtual DbSet<DetallePedido> DetallePedidos { get; set; }

    public virtual DbSet<DetalleVenta> DetalleVentas { get; set; }

    public virtual DbSet<DevolucionCompra> DevolucionCompras { get; set; }

    public virtual DbSet<DevolucionVentum> DevolucionVenta { get; set; }

    public virtual DbSet<Marca> Marcas { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Proveedore> Proveedores { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Trabajadore> Trabajadores { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Venta> Ventas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-GJAFQBRR;Database=Distribuidora;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente);

            entity.ToTable("Cliente");

            entity.Property(e => e.Direccion)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<ClienteJuridico>(entity =>
        {
            entity.HasKey(e => e.Ruc);

            entity.ToTable("ClienteJuridico");

            entity.HasIndex(e => e.IdCliente, "UFk_ClienteJ").IsUnique();

            entity.Property(e => e.Ruc)
                .HasMaxLength(14)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Nombre)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.HasOne(d => d.IdClienteNavigation).WithOne(p => p.ClienteJuridico)
                .HasForeignKey<ClienteJuridico>(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClienteJuridico_Cliente");
        });

        modelBuilder.Entity<ClienteNatural>(entity =>
        {
            entity.HasKey(e => e.IdClienteNatural);

            entity.ToTable("ClienteNatural");

            entity.HasIndex(e => e.IdCliente, "UC_ClienteNatural").IsUnique();

            entity.Property(e => e.PrimerApellido)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.PrimerNombre)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SegundoApellido)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SegundoNombre)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.HasOne(d => d.IdClienteNavigation).WithOne(p => p.ClienteNatural)
                .HasForeignKey<ClienteNatural>(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClienteNatural_Cliente");
        });

        modelBuilder.Entity<Compra>(entity =>
        {
            entity.HasKey(e => e.IdCompra);

            entity.HasIndex(e => e.IdPedido, "UFK_Compras").IsUnique();

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Realizada");
            entity.Property(e => e.TotalCompra).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdPedidoNavigation).WithOne(p => p.Compra)
                .HasForeignKey<Compra>(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Compras_Pedidos");
        });

        modelBuilder.Entity<DetalleCompra>(entity =>
        {
            entity.HasKey(e => new { e.IdCompra, e.IdProducto }).HasName("PK__DetalleC__1AC4527DC1C658E7");

            entity.ToTable("DetalleCompra");

            entity.Property(e => e.Cantidad)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.IdCompraNavigation).WithMany(p => p.DetalleCompras)
                .HasForeignKey(d => d.IdCompra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleCompra_Compras");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleCompras)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleCompra_Productos");
        });

        modelBuilder.Entity<DetalleDevVentum>(entity =>
        {
            entity.HasKey(e => new { e.IdDevVenta, e.IdProducto }).HasName("PK__DetalleD__C55019E978E75319");

            entity.Property(e => e.Cantidad)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.IdDevVentaNavigation).WithMany(p => p.DetalleDevVenta)
                .HasForeignKey(d => d.IdDevVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleDevVenta_DevolucionVenta");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleDevVenta)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleDevVenta_Producto");
        });

        modelBuilder.Entity<DetalleDevoCompra>(entity =>
        {
            entity.HasKey(e => new { e.IdDevCompra, e.IdProducto }).HasName("PK__DetalleD__600F0F8E08973070");

            entity.ToTable("DetalleDevoCompra");

            entity.HasOne(d => d.IdDevCompraNavigation).WithMany(p => p.DetalleDevoCompras)
                .HasForeignKey(d => d.IdDevCompra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleDevoCompra_DevolucionCompra");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleDevoCompras)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleDevoCompra_Producto");
        });

        modelBuilder.Entity<DetallePedido>(entity =>
        {
            entity.HasKey(e => new { e.IdPedido, e.IdProducto }).HasName("PK__DetalleP__8DABD4E2A1898FF6");

            entity.ToTable("DetallePedido");

            entity.Property(e => e.Estado)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.IdPedidoNavigation).WithMany(p => p.DetallePedidos)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetallePedido_Pedidos");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetallePedidos)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetallePedido_Productos");
        });

        modelBuilder.Entity<DetalleVenta>(entity =>
        {
            entity.HasKey(e => new { e.IdVenta, e.IdProducto }).HasName("PK__DetalleV__AC8AC99C14535C8D");

            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Subtotal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("subtotal");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleVentas_Productos");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.IdVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetalleVentas_Ventas");
        });

        modelBuilder.Entity<DevolucionCompra>(entity =>
        {
            entity.HasKey(e => e.IdDevCompra);

            entity.ToTable("DevolucionCompra");

            entity.HasOne(d => d.IdCompraNavigation).WithMany(p => p.DevolucionCompras)
                .HasForeignKey(d => d.IdCompra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DevolucionCompra_Compras");
        });

        modelBuilder.Entity<DevolucionVentum>(entity =>
        {
            entity.HasKey(e => e.IdDevVenta);

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.DevolucionVenta)
                .HasForeignKey(d => d.IdVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DevolucionVenta_Ventas");
        });

        modelBuilder.Entity<Marca>(entity =>
        {
            entity.HasKey(e => e.IdMarca);

            entity.ToTable("Marca");

            entity.Property(e => e.Estado)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("Activo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.IdPedido);

            entity.Property(e => e.Estado)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasDefaultValue("En espera");
            entity.Property(e => e.Ruc)
                .HasMaxLength(14)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Pedidos_Usuario");

            entity.HasOne(d => d.RucNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.Ruc)
                .HasConstraintName("FK_Pedidos_Proveedores");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.IdProducto);

            entity.Property(e => e.Estado)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("Activo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdMarcaNavigation).WithMany(p => p.Productos)
                .HasForeignKey(d => d.IdMarca)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Productos_Marca");
        });

        modelBuilder.Entity<Proveedore>(entity =>
        {
            entity.HasKey(e => e.Ruc);

            entity.Property(e => e.Ruc)
                .HasMaxLength(14)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Direccion)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("Activo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK__Roles__2A49584C2F33B0A6");

            entity.Property(e => e.Estado)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("Activo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Trabajadore>(entity =>
        {
            entity.HasKey(e => e.IdTrabajador);

            entity.Property(e => e.Estado)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasDefaultValue("Activo");
            entity.Property(e => e.PrimerApellido)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.PrimerNombre)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SegundoApellido)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("segundoApellido");
            entity.Property(e => e.SegundoNombre)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);

            entity.ToTable("Usuario");

            entity.Property(e => e.IdUsuario).ValueGeneratedNever();
            entity.Property(e => e.Contrasena)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasDefaultValue("Activo")
                .HasColumnName("estado");
            entity.Property(e => e.NombreUsuario)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuario_Roles");

            entity.HasOne(d => d.IdTrabajadorNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdTrabajador)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuario_Trabajadores");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK_IdVenta");

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Realizada");
            entity.Property(e => e.TotalVenta).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ventas_Cliente");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ventas_Usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
