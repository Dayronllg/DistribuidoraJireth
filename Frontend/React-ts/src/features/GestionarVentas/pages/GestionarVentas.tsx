import { useState } from "react";
import TablaVentas from "../components/TablaVentas";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import AmountInput from "../components/AmountInput";
import TablaFiltroClientes from "../components/TablaFiltroClientes";
import ClienteInput from "../components/ClienteInput";
import BotonAgregar from "../components/BotonAgregar";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";


/*type FilaProductos = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
};*/

type FilaProductos = {
    id: number;
    nombre: string;
    idPresentacion:number,
    nombreP:string
    precio:number;
    cantidad:number;
    estado:string;
};

type FilaClientes = {
  id: number;
  nombreCliente: string;
  telefono: string;
};

type Venta={
  totalVenta:number;
  idCliente:number;
  idUsuario:number;
  detalleVenta:DetalleVenta[]
}

type DetalleVenta = {
  
      cantidad:number,
      precio: number,
      subtotal: number,
      idProducto: number,
      idPresentacion: number
}

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
      (row) => !FilasSeleccionadas.some((r) => r.idPresentacion === row.idPresentacion)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // const para TablaProductosVender.tsx
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.idPresentacion !== id));
  };

  const EditarFilaSeleccionada = (editarFila: FilaProductos) => {
    setFilasSeleccionadas((prev) =>
      prev.map((row) => (row.idPresentacion === editarFila.idPresentacion ? editarFila : row))
    );
  };
  // para calcular el total mijo
  const total = FilasSeleccionadas.reduce(
  (sum, row) => sum + row.precio * row.cantidad,
  0
);

  const enviarVenta = async (venta: Venta) => {
  try {
    const response = await axios.post("http://localhost:5187/api/Ventas/CrearVenta", venta);
    return response.data;
    
  } catch (error) {
    console.error("Error al guardar la venta:", error);
    throw error;
  }
};



const handleAgregarVenta = () => {
  if (!clienteUnicoSeleccionado || FilasSeleccionadas.length === 0) {
    toast.error("Debe seleccionar un cliente y al menos un producto");
    return;
  }

  // Mostrar alerta de confirmación
  confirmAlert({
    title: "¿Confirmar venta?",
    message: "¿Estás seguro que deseas registrar esta venta?",
    buttons: [
      {
        label: "Sí, confirmar",
        onClick: async () => {
          const venta: Venta = {
            totalVenta: total,
            idCliente: clienteUnicoSeleccionado.id,
            idUsuario: Number(localStorage.getItem("idUsuario")),
            detalleVenta: FilasSeleccionadas.map((item) => ({
              cantidad: item.cantidad,
              precio: item.precio,
              subtotal: item.precio * item.cantidad,
              idProducto: item.id,
              idPresentacion: item.idPresentacion,
            })),
          };

          try {
            const resultado = await enviarVenta(venta);
            console.log("Venta registrada con éxito:", resultado);
            toast.success("Venta exitosa");
            setFilasSeleccionadas([]);
            setClienteUnicoSeleccionado(null);
          } catch (error) {
            toast.error("Error al registrar la venta.");
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

      <TablaVentas
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
      />
      <div style={{ padding: "2rem" }}>
        {/* Input del Total a Pagar C$ */}
        <AmountInput Total={total} />
        {/* Boton Agregar */}
        <BotonAgregar AgregarVenta={handleAgregarVenta} />
      </div>
    </div>
  );
}
