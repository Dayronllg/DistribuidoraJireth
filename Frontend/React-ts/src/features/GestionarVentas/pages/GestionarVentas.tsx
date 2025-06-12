import { useState } from "react";
import TablaProductosVender from "../components/TablaProductosVender";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import AmountInput from "../components/AmountInput";

type Row = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};

export default function GestionarVentas() {
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<Row[]>([]);

  const AñadirFilasSeleccionadas = (rows: Row[]) => {
    const nuevos = rows.filter(
      (row) => !FilasSeleccionadas.some((r) => r.id === row.id)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.id !== id));
  };

  const EditarFilaSeleccionada = (editarFila: Row) => {
    setFilasSeleccionadas((prev) =>
      prev.map((row) => (row.id === editarFila.id ? editarFila : row))
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#1b2631",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        Gestionar Ventas
      </h2>
      <TablaFiltroProductos
        AgregarSeleccionado={AñadirFilasSeleccionadas}
        productosYaAgregados={FilasSeleccionadas}
      />

      <TablaProductosVender
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
      <div style={{ padding: "2rem" }}>
        <AmountInput />
      </div>
    </div>
  );
}
