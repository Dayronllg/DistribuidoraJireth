import React from "react";

type PedidosInputData = {
  idPedido: number;
  total: number;
};

type Props = {
  pedido?: PedidosInputData;
  total: number;
  onTotalChange: (nuevoTotal: number) => void;
};
export default function PedidosInput({ pedido, total, onTotalChange }: Props) {
  // El valor ingresado en el input siempre se guarda como número.
  // Si el usuario borra el input o escribe algo no numérico, se guarda 0 para evitar errores.
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onTotalChange(isNaN(value) ? 0 : value);
  };

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
        <label style={labelStyle}>ID Pedido</label>
        <input
          type="text"
          placeholder="ID Pedido"
          value={pedido?.idPedido ?? ""}
          readOnly
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Total</label>
        <input
          type="number"
          placeholder="Total"
          value={total}
          onChange={handleTotalChange}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
