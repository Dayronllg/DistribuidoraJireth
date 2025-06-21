type FilaProductos = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};

type Props = {
  producto: FilaProductos;
};

export default function MarcaInput({ producto }: Props) {
  return (
    <div style={{ padding: "1rem", background: "#121212", color: "#fff" }}>
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
        Información del Producto
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
            value={producto.id}
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
            value={producto.nombre}
            readOnly
          />
        </div>
      </div>

      {/* Precio */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Precio
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
            value={producto.precio}
            readOnly
          />
        </div>
      </div>

      {/* Cantidad */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Cantidad
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
            value={producto.cantidad}
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
            value={producto.estado}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
