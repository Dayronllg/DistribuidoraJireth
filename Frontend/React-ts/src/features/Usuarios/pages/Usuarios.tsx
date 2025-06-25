import { useState } from "react";
import TablaFiltroTrabajadores from "../components/TablaFiltroTrabajadores";
import TablaFiltroRoles from "../components/TablaFiltroRoles";
import RolInput from "../components/RolInput";
import TablaUsuarios from "../components/TablaUsuarios";
import BotonAgregar from "../components/BotonAgregar";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

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

type Usuario = {
  nombreUsuario: string;
  contrasena: string;
  idRol: number;
  idTrabajador: number;
};

function Usuarios() {
  // FilaTrabajadores
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<
    FilaTrabajadores[]
  >([]);

  // Guarda el nombreUsuario y contrasena por cada ID de trabajador
  const [datosUsuario, setDatosUsuario] = useState<
    Record<number, { nombreUsuario: string; contrasena: string }>
  >({});

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
    setDatosUsuario((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // const EditarFilaSeleccionada = (editarFila: FilaTrabajadores) => {
  //   setFilasSeleccionadas((prev) =>
  //     prev.map((row) => (row.id === editarFila.id ? editarFila : row))
  //   );
  // };

  const enviarUsuario = async (usuario: Usuario) => {
    try {
      const response = await axios.post(
        "http://localhost:5187/api/Usuario/Crear",
        usuario
      );
      return response.data;
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      throw error;
    }
  };

  const handleAgregarUsuario = () => {
    if (!rolUnicoSeleccionado || FilasSeleccionadas.length === 0) {
      toast.error("Debe seleccionar un rol y al menos un trabajador");
      return;
    }

    // Validar que todos los trabajadores tengan usuario y contraseña
    for (const fila of FilasSeleccionadas) {
      const datos = datosUsuario[fila.id];
      if (!datos || !datos.nombreUsuario || !datos.contrasena) {
        toast.error(`Faltan datos para el trabajador ID ${fila.id}`);
        return;
      }
      if (datos.nombreUsuario.length > 50) {
        toast.error(`Nombre de usuario demasiado largo para ID ${fila.id}`);
        return;
      }
      if (datos.contrasena.length > 200) {
        toast.error(`Contraseña demasiado larga para ID ${fila.id}`);
        return;
      }
    }

    // Confirmar registro
    confirmAlert({
      title: "¿Confirmar registro?",
      message: "¿Estás seguro que deseas registrar estos usuarios?",
      buttons: [
        {
          label: "Sí, confirmar",
          onClick: async () => {
            try {
              for (const fila of FilasSeleccionadas) {
                const datos = datosUsuario[fila.id];
                const nuevoUsuario: Usuario = {
                  idRol: rolUnicoSeleccionado.id,
                  idTrabajador: fila.id,
                  nombreUsuario: datos.nombreUsuario,
                  contrasena: datos.contrasena,
                };
                await enviarUsuario(nuevoUsuario);
              }

              toast.success("Usuarios registrados con éxito");
              setFilasSeleccionadas([]);
              setRolUnicoSeleccionado(null);
              setDatosUsuario({});
            } catch (error) {
              toast.error("Error al registrar los usuarios.");
            }
          },
        },
        {
          label: "Cancelar",
          onClick: () => {
            toast.info("Registro cancelado");
          },
        },
      ],
    });
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
        datosUsuario={datosUsuario}
        setDatosUsuario={setDatosUsuario}
        Eliminar={EliminarFilasSeleccionadas}
      />
      <div style={{ padding: "2rem" }}>
        {/* Boton Agregar */}
        <BotonAgregar onClick={handleAgregarUsuario} />
      </div>
    </div>
  );
}

export default Usuarios;
