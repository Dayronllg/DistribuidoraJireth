import React, { useState, useMemo, useEffect } from "react";
import type { FilaPedidos } from "../pages/Compras";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";
import axios from "axios";
import type { RowModel } from "../pages/Compras"
import type { Presentacion } from "../../Productos/components/TablaProductos";
import type { Producto } from "../../Productos/components/TablaProductos";

// Definir el tipo de valor de cada fila (producto)
type FilaDetallePedido = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idPedido: number;
  idProducto: number;
  idPresentacion: number;
 nombreProducto:string;
 nombrePresentacion:string
};

type DetallePedido = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idPedido: number;
  idProducto: number;
  idPresentacion: number;
  idPresentacionNavigation:Presentacion
  idProductoNavigation:Producto
};

// Lista temporal solo para probar
type Props = {
  AgregarSeleccionado: (rows: FilaDetallePedido[]) => void;
  productosYaAgregados: FilaDetallePedido[];
  pedido: FilaPedidos | null;
  busquedaIDPedido: RowModel[];
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroDetallePedidos({
  AgregarSeleccionado,
  productosYaAgregados,
  busquedaIDPedido,
  pedido,
}: Props) {
  const [rows, setRows] = useState<FilaDetallePedido[]>([]);
  const [IDSeleccionado, setIDSeleccionado] = useState<string | null>(null);
  const [textoFiltrado, setFilterText] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isPrevClicked, setIsPrevClicked] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
React.useEffect(() => {
  if (!pedido) return; // Si no hay pedido, no ejecutes la llamada

  const obtenerDetalles = async () => {
    try {
      const response = await axios.get<PaginacionResultado<DetallePedido>>(
        "http://localhost:5187/api/Pedidos/ObtenerDetallePedidoCompra",
        {
          params: {
            id: pedido.idPedido,
          },
        }
      );

      const filas: FilaDetallePedido[] = response.data.datos.map((t) => ({
        idDetalle: `${t.idPedido}-${t.idProducto}-${t.idPresentacion}`,
        idPedido: t.idPedido,
        idProducto: t.idProducto,
        idPresentacion: t.idPresentacion,
        cantidadProducto: t.cantidadProducto,
        estado: t.estado,
        nombreProducto: t.idProductoNavigation.nombre,
        nombrePresentacion: t.idPresentacionNavigation.nombre,
      }));

      setRows(filas);
    } catch (error) {
      console.error("Error al obtener detalle del pedido:", error);
      setMensajeError("Hubo un error al cargar el detalle del pedido.");
    }
  };

  obtenerDetalles();
}, [pedido]);

  const FilasFiltradas = useMemo(() => {
    const lowerFilter = textoFiltrado.toLowerCase();
    return rows.filter((row) => row.estado.toLowerCase().includes(lowerFilter));
  }, [textoFiltrado, rows]);

  const totalPages = Math.max(
    1,
    Math.ceil(FilasFiltradas.length / FILAS_POR_PAGINA)
  );

  useEffect(() => {
    if (paginaActual > totalPages) {
      setpaginaActual(totalPages);
    }
  }, [totalPages, paginaActual]);

  const paginatedRows = useMemo(() => {
    const startIndex = (paginaActual - 1) * FILAS_POR_PAGINA;
    return FilasFiltradas.slice(startIndex, startIndex + FILAS_POR_PAGINA);
  }, [FilasFiltradas, paginaActual]);

  const handleSelect = (id: string) => {
    setIDSeleccionado((prev) => (prev === id ? null : id));
  };

  const handleAddSelected = () => {
    if (IDSeleccionado === null) return;

    const seleccionado = rows.find((row) => row.idDetalle === IDSeleccionado);
    if (!seleccionado) return;

    // Validar contra busquedaIDPedido (que viene de TablaCompras)
    const yaExiste = busquedaIDPedido.some(
      (compra) => compra.id === seleccionado.idDetalle
    );

    if (yaExiste) {
      setMensajeError(
        `El detalle con ID ${seleccionado.idDetalle} ya fue agregado a la tabla de compras`
      );
      return;
    }

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    AgregarSeleccionado([seleccionado]);
    setIDSeleccionado(null);
  };

  useEffect(() => {
    if (mensajeError) {
      const timer = setTimeout(() => setMensajeError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeError]);

  const IrPaginaAnterior = () => {
    if (paginaActual > 1) {
      setIsPrevClicked(true);
      setTimeout(() => setIsPrevClicked(false), 150);
      setpaginaActual((page) => Math.max(1, page - 1));
    }
  };

  const IrPaginaSiguiente = () => {
    if (paginaActual < totalPages) {
      setIsNextClicked(true);
      setTimeout(() => setIsNextClicked(false), 150);
      setpaginaActual((page) => Math.min(totalPages, page + 1));
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#121212",
        color: "#fff",
        maxWidth: "720px",
        marginBottom: "0" 
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: 6, marginBottom: 15 }}>
        Detalles Pedidos
      </h3>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          placeholder="Filtrar por estado"
          value={textoFiltrado}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #333",
            backgroundColor: "#1f1f1f",
            color: "#fff",
          }}
          aria-label="Filtrar por estado"
        />
        <button
          onClick={handleAddSelected}
          disabled={IDSeleccionado === null}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: IDSeleccionado === null ? "#555" : "#007bff",
            color: "#fff",
            cursor: IDSeleccionado === null ? "not-allowed" : "pointer",
            userSelect: "none",
            transform: isClicked ? "scale(0.95)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
          aria-label="Añadir fila seleccionada"
        >
          Agregar
        </button>
      </div>

      {mensajeError && (
        <div
          style={{
            backgroundColor: "#ff4d4d",
            color: "#fff",
            padding: "0.5rem",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {mensajeError}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>ID Detalle</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>ID Pedido</th>
            <th style={thStyle}>ID Producto</th>
            <th style={thStyle}>Nombre Producto</th>
            <th style={thStyle}>ID Presentacion</th>
            <th style={thStyle}>Presentacion</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.idDetalle}
                style={{
                  backgroundColor:
                    IDSeleccionado === row.idDetalle ? "#1f1f1f" : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="radio"
                    checked={IDSeleccionado === row.idDetalle}
                    onChange={() => handleSelect(row.idDetalle)}
                    aria-label={`Seleccionar fila con ID ${row.idDetalle}`}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.idDetalle}</td>
                <td style={tdStyle}>{row.cantidadProducto}</td>
                <td style={tdStyle}>{row.idPedido}</td>
                <td style={tdStyle}>{row.idProducto}</td>
                <td style={tdStyle}>{row.nombreProducto}</td>
                <td style={tdStyle}>{row.idPresentacion}</td>
                  <td style={tdStyle}>{row.nombrePresentacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan={9} align="center">
                Sin resultados encontrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <button
          onClick={IrPaginaAnterior}
          disabled={paginaActual === 1}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: paginaActual === 1 ? "#555" : "#007bff",
            color: "#fff",
            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
            transform: isPrevClicked ? "scale(0.95)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
          aria-label="Página Anterior"
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPages}
        </span>
        <button
          onClick={IrPaginaSiguiente}
          disabled={paginaActual === totalPages}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: paginaActual === totalPages ? "#555" : "#007bff",
            color: "#fff",
            cursor: paginaActual === totalPages ? "not-allowed" : "pointer",
            transform: isNextClicked ? "scale(0.95)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
          aria-label="Siguiente Página"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #333",
  padding: "0.5rem",
  textAlign: "left",
  backgroundColor: "#1f1f1f",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #333",
  padding: "0.5rem",
};
