type FilaProveedores = {
  ruc: number;
  nombre: string;
  telefono: string;
};

type Props = {
  proveedores: FilaProveedores;
};

export default function ClienteInput({ proveedores }: Props) {
  return (
    <div style={{ padding: "1rem", background: "#121212", color: "#fff" }}>
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
        Información del proveedor
      </h3>

      {/* RUC */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          RUC
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1f1f1f",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          {/* Sin prefix en este pero puedes aplicar si necesitas */}
          <input
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: "#fff",
              outline: "none",
            }}
            value={proveedores.ruc}
            readOnly
          />
        </div>
      </div>

      {/* Nombre */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Nombre
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1f1f1f",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          <input
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: "#fff",
              outline: "none",
            }}
            value={proveedores.nombre}
            readOnly
          />
        </div>
      </div>

      {/* Telefono */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Telefono
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1f1f1f",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          <input
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: "#fff",
              outline: "none",
            }}
            value={proveedores.telefono}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
