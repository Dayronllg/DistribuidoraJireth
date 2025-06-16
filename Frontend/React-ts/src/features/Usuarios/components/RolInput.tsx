type FilaRoles = {
  id: number;
  rol: string;
  estado: string;
};

type Props = {
  rol: FilaRoles;
};

export default function rolInput({ rol }: Props) {
  return (
    <div style={{ padding: "1rem", background: "#121212", color: "#fff" }}>
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
        Información del rol
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
            value={rol.id}
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
          Rol
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
            value={rol.rol}
            readOnly
          />
        </div>
      </div>

      {/* Estado */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Estado
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
            value={rol.estado}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
