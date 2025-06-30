import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";

type FilaPedidos = {
  idPedido: number;
  fecha: Date; // <-- solo Date
  ruc: string;
  estado: string;
  idusuario: number;
};

 type Pedidos ={
     idPedido: number;
    fechaPedido:Date;
    ruc: string;        
    estado: string;
     idUsuario: number;

}




type Props = {
  AgregarSeleccionado: (rows: FilaPedidos[]) => void;
  productosYaAgregados: FilaPedidos[];
  onSelectSingle: (pedido: FilaPedidos) => void;
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroPedidos({ onSelectSingle }: Props) {
  const [rows,setRows] = useState<FilaPedidos[]>([]);
  const [IDSeleccionado, setIDSeleccionado] = useState<number | null>(null);
  const [textoFiltrado, setFilterText] = useState("");
  const [paginaActual, setpaginaActual] = useState(1);
  const [mensajeError, setMensajeError] = useState<string | null>(null);


  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Pedidos>>(
        "http://localhost:5187/api/Pedidos/ObtenerPedidos",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
      .then((response) => {
        setRows(
          response.data.datos.map((t) => ({
            ...t,
            idPedido:t.idPedido,
            fecha:t.fechaPedido,
            ruc:t.ruc,
            idusuario:t.idUsuario
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener Pedidos:", error);
      });
  }, []);



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
    const seleccionado = rows.find((row) => row.idPedido === id);
    if (onSelectSingle && seleccionado) {
      onSelectSingle(seleccionado);
    }
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
        maxWidth: "700px",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: 6, marginBottom: 15 }}>
        Pedidos
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
          onChange={(e) => setFilterText(e.target.value)}
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
      

      {mensajeError && (
        <div
          style={{
            backgroundColor: "#ff4d4d",
            padding: "0.5rem",
            borderRadius: "4px",
          }}
        >
          {mensajeError}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>RUC</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>ID Usuario</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.idPedido}
                style={{
                  backgroundColor:
                    IDSeleccionado === row.idPedido ? "#1f1f1f" : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="radio"
                    checked={IDSeleccionado === row.idPedido}
                    onChange={() => handleSelect(row.idPedido)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.idPedido}</td>
                <td style={tdStyle}>
                  {new Date(row.fecha).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{row.ruc}</td>
                <td style={tdStyle}>{row.estado}</td>
                <td style={tdStyle}>{row.idusuario}</td>
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
