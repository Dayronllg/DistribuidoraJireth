import TablaPresentaciones from "../components/TablaPresentaciones";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import ProductoInput from "../components/ProductoInput";
import { useState } from "react";

type FilaProductos = {
  id: number;
  nombre: string;
  estado: string;
};

function Presentaciones() {
  const [productoUnicoSeleccionado, setProductoUnicoSeleccionado] =
    useState<FilaProductos | null>(null);
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
        Presentaciones
      </h2>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "1000px" }}>
          <TablaFiltroProductos
            AgregarSeleccionado={(producto) =>
              setProductoUnicoSeleccionado(producto)
            }
            onSelectSingle={(producto) =>
              setProductoUnicoSeleccionado(producto)
            }
          />
        </div>
      </div>
      {/* Render para mostrar el producto seleccionado */}
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        {productoUnicoSeleccionado && (
          <ProductoInput producto={productoUnicoSeleccionado} />
        )}
      </div>
      <div>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Agregar Presentacion
        </h2>
        <TablaPresentaciones producto={productoUnicoSeleccionado} />
      </div>
    </div>
  );
}

export default Presentaciones;
