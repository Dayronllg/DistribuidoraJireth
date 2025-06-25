import React, { useState } from "react";

type Row = {
    id: number;
    nombre: string;
    idPresentacion:number,
    nombreP:string
    precio:number;
    cantidad:number;
    estado:string;
};

type Props = {
  data: Row[]; // Lista de productos a mostrar
  Eliminar: (id: number) => void; // Función para eliminar un producto por ID
  Editar: (filaEditada: Row) => void; // Función para editar un producto
};

export default function TablaPedidos({ data, Eliminar, Editar }: Props) {
  const [editarID, setEditarID] = useState<number | null>(null); // Almacena el id de la fila que está siendo editada actualmente.
  const [editForm, setEditForm] = useState<Partial<Row>>({}); // Almacena temporalmente los valores del formulario de edición.

  // Editar una Fila
  const empezarEditar = (fila: Row) => {
    setEditarID(fila.idPresentacion);
    setEditForm(fila);
  };

  // Cancelar edición
  const cancelarEditar = () => {
    setEditarID(null);
    setEditForm({});
  };

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "cantidad" ? Number(value) : value, // Convierte a número si el campo es precio o cantidad.
    }));
  };

  // Guardar los cambios editados
  const guardarEditar = () => {
    if (
      editarID !== null &&
      editForm.nombre !== undefined &&
      editForm.precio !== undefined &&
      editForm.cantidad !== undefined &&
      editForm.estado !== undefined
    ) {
      Editar(editForm as Row);
      setEditarID(null);
      setEditForm({});
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        background: "#1a1a1a",
        padding: "1rem",
        color: "#fff",
      }}
    >
      <h3 style={{ textAlign: "center" }}>Productos a Pedir</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
             <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>IdPresentacion</th>
            <th style={thStyle}>Presentacion</th>
            <th style={thStyle}>Precio</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
           <tr key={row.idPresentacion}>
              <td style={tdStyle}>{row.id}</td>
              {editarID === row.idPresentacion ? (
                <> 
                  <td style={tdStyle}>{row.nombre}</td>
                  <td style={tdStyle}>{row.idPresentacion}</td>
                  <th style={tdStyle}>{row.nombreP}</th>
                   <td style={tdStyle}>{row.precio}</td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      name="cantidad"
                      value={editForm.cantidad ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={guardarEditar}
                      style={{ ...actionButton, backgroundColor: "#28a745" }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEditar}
                      style={{ ...actionButton, backgroundColor: "#6c757d" }}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{row.nombre}</td>
                  <td style={tdStyle}>{row.idPresentacion}</td>
                  <th style={tdStyle}>{row.nombreP}</th>
                  <td style={tdStyle}>{row.precio}</td>
                  <td style={tdStyle}>{row.cantidad}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => empezarEditar(row)}
                      style={{ ...actionButton }}
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => Eliminar(row.idPresentacion)}
                      style={{
                        ...actionButton,
                        backgroundColor: "#dc3545",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// borde y padding de celdas.
const thStyle: React.CSSProperties = {
  border: "1px solid #333",
  padding: "0.5rem",
  backgroundColor: "#1f1f1f",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #333",
  padding: "0.5rem",
  textAlign: "center",
};

// botones de acción (Modificar, Eliminar, etc.).
const actionButton: React.CSSProperties = {
  marginRight: "0.3rem",
  padding: "0.6rem 0.5rem", // más compacto
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  border: "none",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// apariencia de los inputs al editar.
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.3rem",
  borderRadius: "4px",
  border: "1px solid #555",
  backgroundColor: "#121212",
  color: "#fff",
  fontSize: "0.9rem",
};
