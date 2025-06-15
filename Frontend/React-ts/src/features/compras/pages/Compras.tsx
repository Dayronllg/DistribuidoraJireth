import { useState } from "react";
import TablaFiltroPedidos from "../components/TablaFiltroPedidos";
import TablaCompras from "../components/TablaCompras";

type FilaPedidos = {
  id: number;
  fecha: Date;
  ruc: number;
  estado: string;
  idusuario: number;
};

function Compras() {
  // FilaPedidos
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<FilaPedidos[]>(
    []
  );

  // const TablaFiltroProductos.tsx
  const AñadirFilasSeleccionadas = (rows: FilaPedidos[]) => {
    const nuevos = rows.filter(
      (row) => !FilasSeleccionadas.some((r) => r.id === row.id)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // const para TablaProductosVender.tsx
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.id !== id));
  };

  const EditarFilaSeleccionada = (editarFila: FilaPedidos) => {
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
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Compras</h2>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "500px" }}>
          <TablaFiltroPedidos
            AgregarSeleccionado={AñadirFilasSeleccionadas}
            productosYaAgregados={FilasSeleccionadas}
          />
        </div>
      </div>
      <TablaCompras
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
    </div>
  );
}

export default Compras;
