import React, { useState, useMemo, useEffect } from "react";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";
import axios from "axios";

// Definir el tipo de valor de cada fila (producto)
type FilaProductos = {
  id: number;
  nombre: string;
  idMarca:number;
  nombreM: string
  estado: string;
};

interface marca {
    idMarca: number,
    nombre: string,
    estado: string
}


export interface Producto{

  idProducto: number,
  nombre: string,
  estado: string,
  idMarcaNavigation:marca
 

}


type Props = {
  // Cambio para que reciba una sola marca, no un array
  AgregarSeleccionado: (producto: FilaProductos) => void;
  onSelectSingle: (producto: FilaProductos) => void;
};

const FILAS_POR_PAGINA = 3;

export default function TablaFiltroProductos({
  AgregarSeleccionado,
  onSelectSingle,
}: Props) {
  const [rows,setRows] = useState<FilaProductos[]>([]); // Lista de marcas base
  const [IDSeleccionado, setIDSeleccionado] = useState<number | null>(null); // IDs seleccionados
  const [textoFiltrado, setFilterText] = useState(""); // Texto de filtro
  const [isClicked, setIsClicked] = useState(false);
  const [isPrevClicked, setIsPrevClicked] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [paginaActual, setpaginaActual] = useState(1); // Página actual
  const [mensajeError, setMensajeError] = useState<string | null>(null); // Mensaje de error

  
 React.useEffect(() => {
    axios
      .get<PaginacionResultado<Producto>>(
        "http://localhost:5187/api/Productos/ObtenerSoloProductos",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
     .then((response) => {
      const filas = response.data.datos.map((p) => ({
          id: p.idProducto, // este es el ID que necesita el DataGrid
          idProducto: p.idProducto,
          nombre: p.nombre,
          estado:p.estado,
          nombreM:p.idMarcaNavigation.nombre,
          idMarca:p.idMarcaNavigation.idMarca,
          
        })
      );
      setRows(filas);
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
    });
}, []);


  const FilasFiltradas = useMemo(() => {
    const lowerFilter = textoFiltrado.toLowerCase();
    return rows.filter(
      (row) =>
        (row.nombre ?? "").toLowerCase().includes(lowerFilter) ||
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

  const paginatedRows = useMemo(() => {
    const startIndex = (paginaActual - 1) * FILAS_POR_PAGINA;
    return FilasFiltradas.slice(startIndex, startIndex + FILAS_POR_PAGINA);
  }, [FilasFiltradas, paginaActual]);

  // Cambié para manejar un solo ID seleccionado
  const handleAddSelected = () => {
    if (IDSeleccionado === null) return;

    const marcas = rows.find((r) => r.id === IDSeleccionado);
    if (!marcas) return;

    // Ya no es necesario verificar marcas duplicado porque solo hay uno
    onSelectSingle(marcas);
    AgregarSeleccionado(marcas);

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    setIDSeleccionado(null);
  };

  // Muestra un mensaje de error por 3 segundos si se intenta agregar un producto duplicado.
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

  // Cambié para manejar solo un ID seleccionado
  const handleSelect = (id: number) => {
    setIDSeleccionado(id);
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#121212",
        color: "#fff",
        maxWidth: "1000px",
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
          placeholder="Filtrar por nombre de producto o estado"
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
          aria-label="Filtrar por nombre de producto o estado"
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
          aria-label="Añadir marcas seleccionado"
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
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>ID Marca</th>
            <th style={thStyle}>Marca</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor:
                    IDSeleccionado === row.id ? "#1f1f1f" : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="radio"
                    checked={IDSeleccionado === row.id}
                    onChange={() => handleSelect(row.id)}
                    aria-label={`Select row with ID ${row.id}`}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.nombre}</td>
                <td style={tdStyle}>{row.idMarca}</td>
                <td style={tdStyle}>{row.nombreM}</td>
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
