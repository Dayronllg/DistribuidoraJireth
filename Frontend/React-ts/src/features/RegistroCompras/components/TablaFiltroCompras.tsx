import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";
import { toast } from "react-toastify";

type FilaCompra = {
  idCompra: number;
  totalCompra: number;
  idPedido: number;
  estado: string;
};

type Compra = {
  idCompra: number;
  totalCompra: number;
  idPedido: number;
  estado: string;
};

type Props = {
  onSelectSingle: (compras: FilaCompra) => void;
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroCompras({ onSelectSingle }: Props) {
  const [rows, setRows] = useState<FilaCompra[]>([]);
  const [IDSeleccionado, setIDSeleccionado] = useState<number | null>(null);
  const [textoFiltrado, setFilterText] = useState("");
  const [paginaActual, setpaginaActual] = useState(1);

  // useEffect(() => {
  //   axios
  //     .get<PaginacionResultado<Compra>>(
  //       "DIRECCION HTTP DEL GET COMPRAS DE LA API",
  //       {
  //         params: {
  //           pagina: 1,
  //           tamanioPagina: 100,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setRows(response.data.datos);
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener Compras:", error);
  //     });
  // }, []);

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

  const handleSelect = (id: number) => {
    setIDSeleccionado((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#121212",
        color: "#fff",
        maxWidth: "1400px",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: 6, marginBottom: 15 }}>
        Compras
      </h3>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Filtrar por estado"
          value={textoFiltrado}
          //onChange={(e) => setFilterText(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #333",
            backgroundColor: "#1f1f1f",
            color: "#fff",
          }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>ID Compra</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>ID Pedido</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.idCompra}
                style={{
                  backgroundColor:
                    IDSeleccionado === row.idCompra ? "#1f1f1f" : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="radio"
                    checked={IDSeleccionado === row.idCompra}
                    onChange={() => handleSelect(row.idCompra)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.idCompra}</td>
                <td style={tdStyle}>${row.totalCompra.toFixed(2)}</td>
                <td style={tdStyle}>{row.idPedido}</td>
                <td style={tdStyle}>{row.estado}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      toast.success(`Compra ID ${row.idCompra} cancelada`)
                    }
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "0.3rem 0.6rem",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#bb2d3b")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#dc3545")
                    }
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={tdStyle} align="center">
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
