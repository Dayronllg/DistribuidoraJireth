import { useState } from "react";
import TablaFiltroMarcas from "../components/TablaFiltroMarcas";
import MarcaInput from "../components/MarcaInput";
import TablaProductos from "../components/TablaProductos";

type FilaMarcas = {
  idMarca: number;
  nombre: string;
  estado: string;
};

function Productos() {
  //Pasar datos del componente TablaFiltroClientes al componente ClienteInput
  const [marcaUnicoSeleccionado, setMarcaUnicoSeleccionado] =
    useState<FilaMarcas | null>(null);

  


  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#1b2631",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Productos</h2>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "1000px" }}>
          <TablaFiltroMarcas
            AgregarSeleccionado={(marca) => setMarcaUnicoSeleccionado(marca)}
            onSelectSingle={(marca) => setMarcaUnicoSeleccionado(marca)}
          />
        </div>
      </div>
      {/* Render para mostrar el cliente seleccionado */}
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        {marcaUnicoSeleccionado && (
          <MarcaInput marca={marcaUnicoSeleccionado} />
        )}
      </div>
      <div>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Agregar Producto
        </h2>
        <TablaProductos marca={marcaUnicoSeleccionado}  />
      </div>
    </div>
  );
}

export default Productos;
