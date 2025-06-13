type FilaClientes = {
  id: number;
  nombre: string;
  telefono: string;
};

type Props = {
  cliente: FilaClientes;
};

export default function ClienteInput({ cliente }: Props) {
  return (
    <div style={{ padding: "1rem", background: "#121212", color: "#fff" }}>
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
        Información del cliente
      </h3>

      {/* ID */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          ID
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
            value={cliente.id}
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
            value={cliente.nombre}
            readOnly
          />
        </div>
      </div>

      {/* Teléfono */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Teléfono
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
            value={cliente.telefono}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
