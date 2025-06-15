import React from "react";

type FilaPedidos = {
  id: number;
  fecha: Date;
  ruc: number;
  estado: string;
  idusuario: number;
};

type Props = {
  pedido?: FilaPedidos;
};

// Los Input no reciben aun datos porque pues eso ya lo pasarias vos cuando le conectes la API
// El unico Input modificable es el de cantidad, los demas son ReadOnly

export default function DetallePedidosInput({ pedido }: Props) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "1rem",
    backgroundColor: "#1a1a1a",
    padding: "1rem",
    borderRadius: "6px",
    maxWidth: "100%",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    color: "#ccc",
    fontWeight: "600",
    marginBottom: "0.3rem",
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: "#121212",
    color: "#eee",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      <div style={fieldStyle}>
        <label style={labelStyle}>ID Detalle</label>
        <input
          type="text"
          placeholder="IdDetalle"
          readOnly
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Cantidad</label>
        <input type="number" placeholder="Cantidad" style={inputStyle} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Estado</label>
        <input
          type="text"
          placeholder="Estado"
          value={pedido?.estado ?? ""}
          readOnly
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Id Pedido</label>
        <input
          type="text"
          placeholder="IdPedido"
          value={pedido?.id ?? ""}
          readOnly
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Id Producto</label>
        <input
          type="text"
          placeholder="IdProducto"
          readOnly
          style={inputStyle}
        />
      </div>
    </div>
  );
}
