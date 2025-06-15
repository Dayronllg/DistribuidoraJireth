import React, { useState } from "react";

type FilaPedidos = {
  id: number;
  fecha: Date;
  ruc: number;
  estado: string;
  idusuario: number;
};

type Props = {
  data: FilaPedidos[];
  Eliminar: (id: number) => void;
  Editar: (filaEditada: FilaPedidos) => void;
  pedidoSeleccionadoId: number | null;
  seleccionarPedido: (id: number) => void;
};

export default function TablaCompras({
  data,
  Eliminar,
  Editar,
  pedidoSeleccionadoId,
  seleccionarPedido,
}: Props) {
  const [editarID, setEditarID] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<FilaPedidos>>({});

  const empezarEditar = (fila: FilaPedidos) => {
    setEditarID(fila.id);
    setEditForm(fila);
  };

  const cancelarEditar = () => {
    setEditarID(null);
    setEditForm({});
  };

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "fecha"
          ? new Date(value)
          : name === "ruc" || name === "idusuario"
            ? Number(value)
            : value,
    }));
  };

  const guardarEditar = () => {
    if (
      editarID !== null &&
      editForm.fecha !== undefined &&
      editForm.ruc !== undefined &&
      editForm.estado !== undefined &&
      editForm.idusuario !== undefined
    ) {
      Editar(editForm as FilaPedidos);
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
      <h3 style={{ textAlign: "center" }}>Pedidos Seleccionados</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}></th> {/* Columna para radio button */}
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>RUC</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>ID Usuario</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={tdStyle}>
                <input
                  type="radio"
                  name="pedido"
                  checked={pedidoSeleccionadoId === row.id}
                  onChange={() => seleccionarPedido(row.id)}
                />
              </td>
              <td style={tdStyle}>{row.id}</td>
              {editarID === row.id ? (
                <>
                  <td style={tdStyle}>
                    <input
                      type="date"
                      name="fecha"
                      value={
                        editForm.fecha // toISOString() produce algo asi: 2025-06-15T00:00:00.000Z
                          ? editForm.fecha.toISOString().split("T")[0] // El split('T')[0] deja solo la parte de la fecha (2025-06-15) que necesita el input
                          : ""
                      }
                      onChange={manejarCambio}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      name="ruc"
                      value={editForm.ruc ?? ""}
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
                      type="number"
                      name="idusuario"
                      value={editForm.idusuario ?? ""}
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
                  <td style={tdStyle}>{row.fecha.toLocaleDateString()}</td>
                  <td style={tdStyle}>{row.ruc}</td>
                  <td style={tdStyle}>{row.estado}</td>
                  <td style={tdStyle}>{row.idusuario}</td>
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

const actionButton: React.CSSProperties = {
  marginRight: "0.3rem",
  padding: "0.1rem 0.2rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  border: "none",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.3rem",
  borderRadius: "4px",
  border: "1px solid #555",
  backgroundColor: "#121212",
  color: "#fff",
  fontSize: "0.9rem",
};
