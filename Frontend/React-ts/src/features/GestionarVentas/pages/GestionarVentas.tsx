import { useState } from "react";
import TablaProductosVender from "../components/TablaProductosVender";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import AmountInput from "../components/AmountInput";
import TablaFiltroClientes from "../components/TablaFiltroClientes";
import ClienteInput from "../components/ClienteInput";
import BotonAgregar from "../components/BotonAgregar";

type FilaProductos = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};

type FilaClientes = {
  id: number;
  nombre: string;
  telefono: string;
};

export default function GestionarVentas() {
  // FilaProductos
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<FilaProductos[]>(
    []
  );
  //Pasar datos del componente TablaFiltroClientes al componente ClienteInput
  const [clienteUnicoSeleccionado, setClienteUnicoSeleccionado] =
    useState<FilaClientes | null>(null);

  // const TablaFiltroProductos.tsx
  const AñadirFilasSeleccionadas = (rows: FilaProductos[]) => {
    const nuevos = rows.filter(
      (row) => !FilasSeleccionadas.some((r) => r.id === row.id)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // const para TablaProductosVender.tsx
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.id !== id));
  };

  const EditarFilaSeleccionada = (editarFila: FilaProductos) => {
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

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "500px" }}>
          <TablaFiltroProductos
            AgregarSeleccionado={AñadirFilasSeleccionadas}
            productosYaAgregados={FilasSeleccionadas}
          />
        </div>
        <div style={{ flex: 0.6, minWidth: "350px" }}>
          <TablaFiltroClientes
            AgregarSeleccionado={(cliente) =>
              setClienteUnicoSeleccionado(cliente)
            }
            onSelectSingle={(cliente) => setClienteUnicoSeleccionado(cliente)}
          />
        </div>
      </div>
      {/* Render para mostrar el cliente seleccionado */}
      <div style={{ marginTop: "30px" }}>
        {clienteUnicoSeleccionado && (
          <ClienteInput cliente={clienteUnicoSeleccionado} />
        )}
      </div>

      <TablaProductosVender
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
      <div style={{ padding: "2rem" }}>
        {/* Input del Total a Pagar C$ */}
        <AmountInput />
        {/* Boton Agregar */}
        <BotonAgregar />
      </div>
    </div>
  );
}
