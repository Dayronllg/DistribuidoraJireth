import React, { useState, useMemo } from "react";

type Row = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};

const initialRows: Row[] = [
  { id: 1, nombre: "Jon", precio: 35, cantidad: 3, estado: "Snow" },
  { id: 2, nombre: "Cersei", precio: 42, cantidad: 5, estado: "Lannister" },
  { id: 3, nombre: "Jaime", precio: 45, cantidad: 7, estado: "Lannister" },
  { id: 4, nombre: "Arya", precio: 16, cantidad: 2, estado: "Stark" },
  { id: 5, nombre: "Daenerys", precio: 29, cantidad: 6, estado: "Targaryen" },
];

//Máximo de filas a mostrar para el empaginado
const ROWS_PER_PAGE = 2;

export default function CustomTable() {
  const [rows] = useState<Row[]>(initialRows);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const lowerFilter = filterText.toLowerCase();
    return rows.filter(
      (row) =>
        (row.nombre ?? "").toLowerCase().includes(lowerFilter) ||
        row.estado.toLowerCase().includes(lowerFilter)
    );
  }, [filterText, rows]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE)
  );

  // Ajustar currentPage si se pasa del total al filtrar
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Filas a mostrar en la página actual
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredRows.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRows.map((row) => row.id));
    }
  };

  const handleAddSelected = () => {
    if (selectedIds.length === 0) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
    console.log("Filas seleccionadas para agregar:", selectedRows);
    // Aquí haces lo que necesites con selectedRows
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#121212",
        color: "#fff",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Filtrar por nombre o estado"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #333",
            backgroundColor: "#1f1f1f",
            color: "#fff",
          }}
          aria-label="Filtrar por nombre o estado"
        />
        <button
          onClick={handleAddSelected}
          disabled={selectedIds.length === 0}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: selectedIds.length === 0 ? "#555" : "#007bff",
            color: "#fff",
            cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
            userSelect: "none",
            transform: isClicked ? "scale(0.95)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
          aria-label="Añadir filas seleccionadas"
        >
          Agregar
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>
              <input
                type="checkbox"
                checked={
                  paginatedRows.length > 0 &&
                  selectedIds.length === paginatedRows.length
                }
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      selectedIds.length > 0 &&
                      selectedIds.length < paginatedRows.length;
                  }
                }}
                onChange={handleSelectAll}
                aria-label="Select all rows on current page"
                style={{ cursor: "pointer" }}
              />
            </th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Precio</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: selectedIds.includes(row.id)
                    ? "#1f1f1f"
                    : "inherit",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                    aria-label={`Select row with ID ${row.id}`}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                {/* Encabezados de la tabla */}
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.nombre}</td>
                <td style={tdStyle}>{row.precio}</td>
                <td style={tdStyle}>{row.cantidad}</td>
                <td style={tdStyle}>{row.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan={5} align="center">
                No rows found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de paginación */}
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
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: currentPage === 1 ? "#555" : "#007bff",
            color: "#fff",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
          aria-label="Previous page"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: currentPage === totalPages ? "#555" : "#007bff",
            color: "#fff",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
          aria-label="Next page"
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
