import React, { useState } from "react";
import { toast } from "react-toastify";

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
  datosUsuario: Record<number, { nombreUsuario: string; contrasena: string }>;
  setDatosUsuario: React.Dispatch<
    React.SetStateAction<
      Record<number, { nombreUsuario: string; contrasena: string }>
    >
  >; // Función para editar un producto
  Eliminar: (id: number) => void; // Función para eliminar un producto por ID
};

export default function TablaVentas({
  data,
  datosUsuario,
  setDatosUsuario,
  Eliminar,
}: Props) {
  const [editarID, setEditarID] = useState<number | null>(null); // Almacena el id de la fila que está siendo editada actualmente.

  // Editar una Fila
  const empezarEditar = (id: number) => {
    setEditarID(id);
  };

  // Cancelar edición
  const cancelarEditar = () => {
    setEditarID(null);
  };

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (
    id: number,
    campo: "nombreUsuario" | "contrasena",
    valor: string
  ) => {
    setDatosUsuario((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  // Guardar los cambios editados
  const guardarEditar = (id: number) => {
    const datos = datosUsuario[id];
    if (!datos) return;

    const { nombreUsuario, contrasena } = datos;

    if (!nombreUsuario || nombreUsuario.trim() === "") {
      toast.error("El nombre de usuario es obligatorio.");
      return;
    }
    if (nombreUsuario.length > 50) {
      toast.error("El nombre de usuario no debe superar los 50 caracteres.");
      return;
    }
    if (!contrasena || contrasena.trim() === "") {
      toast.error("La contraseña es obligatoria.");
      return;
    }
    if (contrasena.length > 200) {
      toast.error("La contraseña no debe superar los 200 caracteres.");
      return;
    }

    toast.success("Campos actualizados correctamente.");
    setEditarID(null);
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
          {data.map((row) => {
            const usuario = datosUsuario[row.id] ?? {
              nombreUsuario: "",
              contrasena: "",
            };

            return (
              <tr key={row.id}>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.primerNombre}</td>
                <td style={tdStyle}>{row.primerApellido}</td>
                <td style={tdStyle}>{row.telefono}</td>
                <td style={tdStyle}>{row.estado}</td>

                {editarID === row.id ? (
                  <>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={usuario.nombreUsuario}
                        onChange={(e) =>
                          manejarCambio(row.id, "nombreUsuario", e.target.value)
                        }
                        maxLength={50}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={usuario.contrasena}
                        onChange={(e) =>
                          manejarCambio(row.id, "contrasena", e.target.value)
                        }
                        maxLength={200}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => guardarEditar(row.id)}
                        style={{
                          ...actionButton,
                          backgroundColor: "#28a745",
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelarEditar}
                        style={{
                          ...actionButton,
                          backgroundColor: "#6c757d",
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>
                      {usuario.nombreUsuario.trim() || "-"}
                    </td>
                    <td style={tdStyle}>
                      {usuario.contrasena ? "••••••" : "-"}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => empezarEditar(row.id)}
                        style={actionButton}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => Eliminar(row.id)}
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
            );
          })}
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
