import { useState } from "react";
import TablaFiltroTrabajadores from "../components/TablaFiltroTrabajadores";
import TablaFiltroRoles from "../components/TablaFiltroRoles";
import RolInput from "../components/RolInput";
import TablaUsuarios from "../components/TablaUsuarios";
import BotonAgregar from "../components/BotonAgregar";

type FilaTrabajadores = {
  id: number;
  primerNombre: string;
  primerApellido: string;
  telefono: string;
  estado: string;
};

type FilaRoles = {
  id: number;
  rol: string;
  estado: string;
};

function Usuarios() {
  // FilaTrabajadores
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<
    FilaTrabajadores[]
  >([]);

  //Pasar datos del componente TablaFiltroRoles al componente RolInput
  const [rolUnicoSeleccionado, setRolUnicoSeleccionado] =
    useState<FilaRoles | null>(null);

  // const TablaUsuarios.tsx
  const AñadirFilasSeleccionadas = (rows: FilaTrabajadores[]) => {
    const nuevos = rows.filter(
      (row) => !FilasSeleccionadas.some((r) => r.id === row.id)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // const para TablaUsuarios.tsx
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.id !== id));
  };

  const EditarFilaSeleccionada = (editarFila: FilaTrabajadores) => {
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
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Usuarios</h2>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "500px" }}>
          <TablaFiltroTrabajadores
            AgregarSeleccionado={AñadirFilasSeleccionadas}
            trabajadoresYaAgregados={FilasSeleccionadas}
          />
        </div>
        <div style={{ flex: 0.6, minWidth: "350px" }}>
          <TablaFiltroRoles
            AgregarSeleccionado={(rol) => setRolUnicoSeleccionado(rol)}
            onSelectSingle={(rol) => setRolUnicoSeleccionado(rol)}
          />
        </div>
      </div>
      {/* Render para mostrar el Rol seleccionado */}
      <div style={{ marginTop: "30px" }}>
        {rolUnicoSeleccionado && <RolInput rol={rolUnicoSeleccionado} />}
      </div>

      <TablaUsuarios
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
      <div style={{ padding: "2rem" }}>
        {/* Boton Agregar */}
        <BotonAgregar />
      </div>
    </div>
  );
}

export default Usuarios;
