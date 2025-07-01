import React, { useState, useMemo, useEffect } from "react";
import type { Presentacion } from "../../Productos/components/TablaProductos";
import type { Producto } from "../../Productos/components/TablaProductos";
import axios from "axios";
import type { RowModel } from "../pages/RegistroCompras"; // si tienes uno

// Tipo para cada fila de la tabla
type FilaDetalleCompra = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idCompra: number;
  idProducto: number;
  idPresentacion: number;
  nombreProducto: string;
  nombrePresentacion: string;
};

type DetalleCompra = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idCompra: number;
  idProducto: number;
  idPresentacion: number;
  idPresentacionNavigation: Presentacion;
  idProductoNavigation: Producto;
};

type Props = {
  AgregarSeleccionado: (rows: FilaDetalleCompra[]) => void;
  productosYaAgregados: FilaDetalleCompra[];
  compraID: number | null;
  busquedaIDCompra: RowModel[];
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroDetalleCompras({
  AgregarSeleccionado,
  productosYaAgregados,
  busquedaIDCompra,
  compraID,
}: Props) {
  const [rows, setRows] = useState<FilaDetalleCompra[]>([]);
  const [IDSeleccionado, setIDSeleccionado] = useState<string | null>(null);
  const [textoFiltrado, setFilterText] = useState("");
  const [paginaActual, setpaginaActual] = useState(1);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  useEffect(() => {
    if (!compraID) return;

    const obtenerDetalles = async () => {
      try {
        const response = await axios.get<{ datos: DetalleCompra[] }>(
          "http://localhost:5187/api/Compras/ObtenerDetalleCompra", // AQUI PONE TU RUTA
          {
            params: {
              id: compraID,
            },
          }
        );

        const filas: FilaDetalleCompra[] = response.data.datos.map((t) => ({
          idDetalle: `${t.idCompra}-${t.idProducto}-${t.idPresentacion}`,
          idCompra: t.idCompra,
          idProducto: t.idProducto,
          idPresentacion: t.idPresentacion,
          cantidadProducto: t.cantidadProducto,
          estado: t.estado,
          nombreProducto: t.idProductoNavigation.nombre,
          nombrePresentacion: t.idPresentacionNavigation.nombre,
        }));

        setRows(filas);
      } catch (error) {
        console.error("Error al obtener detalle de la compra:", error);
        setMensajeError("Error al cargar el detalle de la compra.");
      }
    };

    obtenerDetalles();
  }, [compraID]);

  const FilasFiltradas = useMemo(() => {
    return rows.filter((row) =>
      row.estado.toLowerCase().includes(textoFiltrado.toLowerCase())
    );
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

    const yaExiste = busquedaIDCompra.some(
      (compra) => compra.id === seleccionado.idDetalle
    );

    if (yaExiste) {
      setMensajeError(`Este detalle ya fue agregado.`);
      return;
    }

    AgregarSeleccionado([seleccionado]);
    setIDSeleccionado(null);
  };

  useEffect(() => {
    if (mensajeError) {
      const timer = setTimeout(() => setMensajeError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeError]);

  return (
    <div
      style={{
        padding: "1rem",
        background: "#121212",
        color: "#fff",
        maxWidth: "1400px",
      }}
    >
      <h3 style={{ textAlign: "center", margin: "10px 0" }}>
        Detalles de Compras
      </h3>

      <input
        type="text"
        placeholder="Filtrar por estado"
        value={textoFiltrado}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          border: "1px solid #333",
          backgroundColor: "#1f1f1f",
          color: "#fff",
        }}
      />

      {mensajeError && (
        <div
          style={{
            backgroundColor: "#ff4d4d",
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
            <th style={thStyle}>ID Compra</th>
            <th style={thStyle}>ID Producto</th>
            <th style={thStyle}>Producto</th>
            <th style={thStyle}>ID Presentación</th>
            <th style={thStyle}>Presentación</th>
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
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.idDetalle}</td>
                <td style={tdStyle}>{row.cantidadProducto}</td>
                <td style={tdStyle}>{row.idCompra}</td>
                <td style={tdStyle}>{row.idProducto}</td>
                <td style={tdStyle}>{row.nombreProducto}</td>
                <td style={tdStyle}>{row.idPresentacion}</td>
                <td style={tdStyle}>{row.nombrePresentacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={tdStyle} align="center">
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
        }}
      >
        <button
          onClick={() => setpaginaActual((p) => Math.max(1, p - 1))}
          disabled={paginaActual === 1}
          style={paginationButtonStyle(paginaActual === 1)}
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPages}
        </span>
        <button
          onClick={() => setpaginaActual((p) => Math.min(totalPages, p + 1))}
          disabled={paginaActual === totalPages}
          style={paginationButtonStyle(paginaActual === totalPages)}
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

const paginationButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "0.4rem 0.8rem",
  borderRadius: "4px",
  border: "none",
  backgroundColor: disabled ? "#555" : "#007bff",
  color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
});
