import TablaPedidos from "../components/TablaPedidos";
import ProductoInput from "../components/ProveedorInput";
import { useState } from "react";
import TablaFiltroProveedores from "../components/TablaFiltroProveedores";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import BotonAgregar from "../components/BotonAgregar";

type FilaProductos = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};

type FilaProveedores = {
  ruc: number;
  nombreProveedor: string;
  telefono: string;
};

function Pedidos() {
  // FilaProductos
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<FilaProductos[]>(
    []
  );
  //Pasar datos del componente TablaFiltroProveedores al componente ProveedorInput
  const [proveedorUnicoSeleccionado, setProveedorUnicoSeleccionado] =
    useState<FilaProveedores | null>(null);

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
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Pedidos</h2>
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
          <TablaFiltroProveedores
            AgregarSeleccionado={(provedores) =>
              setProveedorUnicoSeleccionado(provedores)
            }
            onSelectSingle={(proveedores) =>
              setProveedorUnicoSeleccionado(proveedores)
            }
          />
        </div>
      </div>
      {/* Render para mostrar el proveedor seleccionado */}
      <div style={{ marginTop: "30px" }}>
        {proveedorUnicoSeleccionado && (
          <ProductoInput proveedores={proveedorUnicoSeleccionado} />
        )}
      </div>
      <TablaPedidos
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
      <BotonAgregar />
    </div>
  );
}

export default Pedidos;
