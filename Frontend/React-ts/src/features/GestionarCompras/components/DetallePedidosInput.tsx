import React, { useEffect, useState } from "react";

type FilaDetallePedidos = {
  cantidad: number;
  idProducto: number;
  idPresentacion: number;
};

type Props = {
  detallePedido?: FilaDetallePedidos;
  onCantidadChange?: (cantidad: number) => void;
};

export default function DetallePedidosInput({
  detallePedido,
  onCantidadChange,
}: Props) {
  const [cantidad, setCantidad] = useState<number>(
    detallePedido?.cantidad ?? 0
  );

  useEffect(() => {
    setCantidad(detallePedido?.cantidad ?? 0);
  }, [detallePedido]);

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const nuevaCantidad = isNaN(value) ? 0 : value;
    setCantidad(nuevaCantidad);
    onCantidadChange?.(nuevaCantidad); // Notifica al padre
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

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <div style={fieldStyle}>
        <label>Cantidad</label>
        <input
          type="number"
          value={cantidad}
          onChange={handleCantidadChange}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label>ID Producto</label>
        <input
          type="text"
          value={detallePedido?.idProducto ?? ""}
          readOnly
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label>ID Presentación</label>
        <input
          type="text"
          value={detallePedido?.idPresentacion ?? ""}
          readOnly
          style={inputStyle}
        />
      </div>
    </div>
  );
}
