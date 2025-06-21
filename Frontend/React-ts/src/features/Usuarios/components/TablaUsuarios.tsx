import React, { useState } from "react";

type Row = {
  id: number;
  primerNombre: string;
  primerApellido: string;
  telefono: string;
  estado: string;
  nombreUsuario?: string;
  contraseña?: string;
};

type Props = {
  data: Row[]; // Lista de productos a mostrar
  Eliminar: (id: number) => void; // Función para eliminar un producto por ID
  Editar: (filaEditada: Row) => void; // Función para editar un producto
};

export default function TablaVentas({ data, Eliminar, Editar }: Props) {
  const [editarID, setEditarID] = useState<number | null>(null); // Almacena el id de la fila que está siendo editada actualmente.
  const [editForm, setEditForm] = useState<Partial<Row>>({}); // Almacena temporalmente los valores del formulario de edición.

  // Editar una Fila
  const empezarEditar = (fila: Row) => {
    setEditarID(fila.id);
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
      [name]: value,
    }));
  };

  // Guardar los cambios editados
  const guardarEditar = () => {
    if (
      editarID !== null &&
      editForm.primerNombre &&
      editForm.primerApellido &&
      editForm.telefono &&
      editForm.estado &&
      editForm.nombreUsuario &&
      editForm.contraseña
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
      <h3 style={{ textAlign: "center" }}>Usuarios a Agregar</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Primer Nombre</th>
            <th style={thStyle}>Primer Apellido</th>
            <th style={thStyle}>Telefono</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Nombre Usuario</th>
            <th style={thStyle}>Contraseña</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={tdStyle}>{row.id}</td>
              {editarID === row.id ? (
                <>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="primerNombre"
                      value={editForm.primerNombre ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="primerApellido"
                      value={editForm.primerApellido ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="telefono"
                      value={editForm.telefono ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="estado"
                      value={editForm.estado ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="nombreUsuario"
                      value={editForm.nombreUsuario ?? ""}
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="contraseña"
                      value={editForm.contraseña ?? ""}
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
                  <td style={tdStyle}>{row.primerNombre}</td>
                  <td style={tdStyle}>{row.primerApellido}</td>
                  <td style={tdStyle}>{row.telefono}</td>
                  <td style={tdStyle}>{row.estado}</td>

                  {/* Si row.nombreUsuario no es null ni undefined, se muestra su valor.
                      Si es null o undefined, se muestra "-" como texto por defecto */}
                  <td style={tdStyle}>{row.nombreUsuario ?? "-"}</td>

                  {/* Si row.contraseña tiene algún valor (no vacío, ni undefined, ni null), se muestra •••••• */}
                  <td style={tdStyle}>{row.contraseña ? "••••••" : "-"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => empezarEditar(row)}
                      style={actionButton}
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => Eliminar(row.id)}
                      style={{ ...actionButton, backgroundColor: "#dc3545" }}
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
