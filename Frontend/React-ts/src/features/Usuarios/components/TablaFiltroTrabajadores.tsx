import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";

// Definir el tipo de valor de cada fila (producto)
type FilaTrabajadores = {
  id: number;
  primerNombre: string;
  primerApellido: string;
  telefono: string;
  estado: string;
};

export interface Trabajadores {
  idTrabajador: number;
  primerNombre: string;
  //segundoNombre: string;
  primerApellido: string;
  //segundoApellido: string;
  telefono: string;
  estado: string;
}

type Props = {
  AgregarSeleccionado: (rows: FilaTrabajadores[]) => void; // función para notificar al componente padre qué productos se van a agregar.
  trabajadoresYaAgregados: FilaTrabajadores[]; // lista de productos que ya fueron agregados (para prevenir duplicados).
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroProductos({
  AgregarSeleccionado,
  trabajadoresYaAgregados,
}: Props) {
  const [rows, setRows] = useState<FilaTrabajadores[]>(); // Lista de productos base
  const [IDSeleccionado, setIDSeleccionado] = useState<number[]>([]); // IDs seleccionados
  const [textoFiltrado, setFilterText] = useState(""); // Texto de filtro
  const [isClicked, setIsClicked] = useState(false);
  const [isPrevClicked, setIsPrevClicked] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1); // Página actual
  const [mensajeError, setMensajeError] = useState<string | null>(null); // Mensaje de error

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Trabajadores>>(
        "http://localhost:5187/api/Trabajadores/ObtenerTrabajadores",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
      .then((response) => {
        const filas = response.data.datos.map((trabajador) => ({
          id: trabajador.idTrabajador,
          primerNombre: trabajador.primerNombre,
          //segundoNombre: trabajador.segundoNombre,
          primerApellido: trabajador.primerApellido,
          //segundoApellido: trabajador.segundoApellido,
          telefono: trabajador.telefono,
          estado: trabajador.estado,
        }));

        setRows(filas);
      })
      .catch((error) => {
        console.error("Error al obtener trabajadores:", error);
      });
  }, []);

  const FilasFiltradas = useMemo(() => {
    const lowerFilter = textoFiltrado.toLowerCase();
    return (rows ?? []).filter(
      (row) =>
        (row.primerNombre ?? "").toLowerCase().includes(lowerFilter) ||
        row.estado.toLowerCase().includes(lowerFilter)
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

  // Mostrar cierta telefono de filas por página
  const paginatedRows = useMemo(() => {
    const startIndex = (paginaActual - 1) * FILAS_POR_PAGINA;
    return FilasFiltradas.slice(startIndex, startIndex + FILAS_POR_PAGINA);
  }, [FilasFiltradas, paginaActual]);

  // Alterna selección individual
  const handleSelect = (id: number) => {
    setIDSeleccionado((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selecciona todas las visibles
  const handleSelectAll = () => {
    if (IDSeleccionado.length === paginatedRows.length) {
      setIDSeleccionado([]);
    } else {
      setIDSeleccionado(paginatedRows.map((row) => row.id));
    }
  };

  const handleAddSelected = () => {
    if (IDSeleccionado.length === 0) return;

    // Obtiene productos seleccionados
    const nuevosSeleccionados = rows!
      .filter((row) => IDSeleccionado.includes(row.id))
      .map((row: FilaTrabajadores) => ({ ...row }));

    const yaAgregados = nuevosSeleccionados.filter((row) =>
      trabajadoresYaAgregados.some((p) => p.id === row.id)
    );

    // Mostrar error si hay duplicados
    if (yaAgregados.length > 0) {
      setMensajeError(
        `Los siguientes trabajadores ya fueron agregados: ${yaAgregados.map((r) => r.primerNombre).join(", ")}`
      );
      return;
    }

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    // Llama al padre para agregarlos
    AgregarSeleccionado(nuevosSeleccionados);
    setIDSeleccionado([]); // limpiar selección tras agregar
  };

  // Muestra un mensaje de error por 3 segundos si se intenta agregar un trabajador duplicado.
  useEffect(() => {
    if (mensajeError) {
      const timer = setTimeout(() => setMensajeError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeError]);

  // Actualizan paginaActual respetando los límites de la paginación.
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
        maxWidth: "1000px",
        //margin: "auto", // Centrar tabla
        margin: "0", // Alinear tabla a la izquierda en lugar de centrarla
      }}
    >
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
          placeholder="Filtrar por nombre de trabajador o apellido"
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
          aria-label="Filtrar por nombre de trabajador o apellido"
        />
        <button
          onClick={handleAddSelected}
          disabled={IDSeleccionado.length === 0}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: IDSeleccionado.length === 0 ? "#555" : "#007bff",
            color: "#fff",
            cursor: IDSeleccionado.length === 0 ? "not-allowed" : "pointer",
            userSelect: "none",
            transform: isClicked ? "scale(0.95)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
          aria-label="Añadir filas seleccionadas"
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
            <th style={thStyle}>
              <input
                type="checkbox"
                checked={
                  paginatedRows.length > 0 &&
                  IDSeleccionado.length === paginatedRows.length
                }
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      IDSeleccionado.length > 0 &&
                      IDSeleccionado.length < paginatedRows.length;
                  }
                }}
                onChange={handleSelectAll}
                aria-label="Select all rows on current page"
                style={{ cursor: "pointer" }}
              />
            </th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Primer Nombre</th>
            <th style={thStyle}>Primer Apellido</th>
            <th style={thStyle}>Telefono</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: IDSeleccionado.includes(row.id)
                    ? "#1f1f1f"
                    : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={IDSeleccionado.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                    aria-label={`Select row with ID ${row.id}`}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.primerNombre}</td>
                <td style={tdStyle}>{row.primerApellido}</td>
                <td style={tdStyle}>{row.telefono}</td>
                <td style={tdStyle}>{row.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              {/* No se encontraron resultados similares */}
              <td style={tdStyle} colSpan={6} align="center">
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
