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

 const AñadirFilasSeleccionadas = (rows: FilaProductos[]) => {
  const nuevos = rows
    .filter((row) => !FilasSeleccionadas.some((r) => r.idPresentacion === row.idPresentacion))
    .map((row) => ({
      ...row,
      stockDisponible: row.cantidad,    // ✅ Guardar la cantidad original
      cantidad: 1                       // ✅ Iniciar con cantidad 1 por defecto
    }));
  
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



 //Calcular total de subtotales
const totalSubtotales = FilasSeleccionadas.reduce(
  (sum, row) => sum + row.precio * row.cantidad,
  0
);

// Calcular total con 7% extra
const totalConIncremento = totalSubtotales + totalSubtotales * 0.07;

// Al guardar la venta
const handleAgregarVenta = () => {
  if (!clienteUnicoSeleccionado || FilasSeleccionadas.length === 0) {
    toast.error("Debe seleccionar un cliente y al menos un producto");
    return;
  }

  

  confirmAlert({
    title: "¿Confirmar venta?",
    message: "¿Estás seguro que deseas registrar esta venta?",
    buttons: [
      {
        label: "Sí, confirmar",
        onClick: async () => {
          const venta: Venta = {
            totalVenta: totalConIncremento,  // ✅ Aquí mandás el total con el 7%
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
          } catch (error:any) {
            toast.error("Error al registrar la venta.");
            toast.error(error.response.data)
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
  <div style={{ marginBottom: "1rem" }}>
    <strong>Subtotal:</strong> C$ {totalSubtotales.toFixed(2)}
  </div>
  <div style={{ marginBottom: "1rem" }}>
    <strong>Total + 7%:</strong> C$ {totalConIncremento.toFixed(2)}
  </div>

  <AmountInput Total={totalConIncremento} />
  <BotonAgregar AgregarVenta={handleAgregarVenta} />
</div>
</div>
  );
}
