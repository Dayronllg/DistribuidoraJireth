import TablaPedidos from "../components/TablaPedidos";
import ProductoInput from "../components/ProveedorInput";
import { useState } from "react";
import TablaFiltroProveedores from "../components/TablaFiltroProveedores";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import BotonAgregar from "../components/BotonAgregar";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

type FilaProductos = {
  id: number;
  nombre: string;
  idPresentacion: number;
  nombreP: string;
  precio: number;
  cantidad: number;
  estado: string;
};

type FilaProveedores = {
  ruc: number;
  nombreProveedor: string;
  telefono: string;
};

type detallePedio = {
  cantidadProducto: number;
  estado: string;
  idProducto: number;
  idPresentacion: number;
};
type CrearPedido = {
  ruc: string;
  estado: string;
  idUsuario: number;
  detallePedidos: detallePedio[];
};
const enviarPedido = async (venta: CrearPedido) => {
  try {
    const response = await axios.post(
      "http://localhost:5187/api/Pedidos/CrearPedido",
      venta
    );
    return response.data;
  } catch (error) {
    console.error("Error al guardar la venta:", error);
    throw error;
  }
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
      (row) =>
        !FilasSeleccionadas.some((r) => r.idPresentacion === row.idPresentacion)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // const para TablaProductosVender.tsx
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) =>
      prev.filter((row) => row.idPresentacion !== id)
    );
  };

  const EditarFilaSeleccionada = (editarFila: FilaProductos) => {
    setFilasSeleccionadas((prev) =>
      prev.map((row) =>
        row.idPresentacion === editarFila.idPresentacion ? editarFila : row
      )
    );
  };

  const handleAgregarPedido = () => {
    if (!proveedorUnicoSeleccionado || FilasSeleccionadas.length === 0) {
      toast.error("Debe seleccionar un cliente y al menos un producto");
      return;
    }

    // Mostrar alerta de confirmación
    confirmAlert({
      title: "¿Confirmar Pedido?",
      message: "¿Estás seguro que deseas registrar este pedido?",
      buttons: [
        {
          label: "Sí, confirmar",
          onClick: async () => {
            const pedido: CrearPedido = {
              ruc: String(proveedorUnicoSeleccionado.ruc),
              estado: "En espera",
              idUsuario: Number(localStorage.getItem("idUsuario")),
              detallePedidos: FilasSeleccionadas.map((item) => ({
              cantidadProducto:item.cantidad,
               estado: "En espera",
               idProducto:item.id,
               idPresentacion:item.idPresentacion
              })),
            };
                
            try {
              const resultado = await enviarPedido(pedido);
              console.log("Pedido registrado con éxito:", resultado);
              toast.success("Pedido exitoso");
              setFilasSeleccionadas([]);
              setProveedorUnicoSeleccionado(null);
            } catch (error) {
              toast.error("Error al registrar el pedido");
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
      <BotonAgregar AgregarPedido={handleAgregarPedido} />
    </div>
  );
}

export default Pedidos;
