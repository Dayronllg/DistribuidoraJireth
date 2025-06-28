import { useState } from "react";
import TablaFiltroPedidos from "../components/TablaFiltroPedidos";
import TablaFiltroDetallePedidos from "../components/TablaFiltroDetallePedidos";
import PedidosInput from "../components/PedidosInput";
import DetallePedidosInput from "../components/DetallePedidosInput";
import BotonAgregar from "../components/BotonAgregar";
import TablaCompras from "../components/TablaCompras";
import BotonFinalizarCompra from "../components/BotonFinalizarCompra";
import { randomId } from "@mui/x-data-grid-generator";
import type { GridValidRowModel } from "@mui/x-data-grid/models";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "axios";

export type FilaPedidos = {
  idPedido: number;
  fecha: Date;
  ruc: string;
  estado: string;
  idusuario: number;
};

type detalleCompra = {
  cantidad: number;

  idProducto: number;
  idPresentacion: number;
};

export type FilaDetallePedido = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idPedido: number;
  idProducto: number;
  idPresentacion: number;
};

export interface FilaCompra {
  id: String;
  cantidad: number;
  idProducto: number;
  idPresentacion: number;
  isNew: boolean;
}

type crearCompra = {
  totalCompra: number;
  idPedido: number;
  detalleCompra: detalleCompra[];
};

function Compras() {
  // Seleccionar el Pedido
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<FilaPedidos | null>(null);

  const seleccionarPedido = (pedido: FilaPedidos) => {
    setPedidoSeleccionado(pedido);
    setDetalleSeleccionado(null);
  };

  // Seleccionar el detallePedido
  const [detalleSeleccionado, setDetalleSeleccionado] =
    useState<FilaDetallePedido | null>(null);

  const seleccionarDetalle = (rows: FilaDetallePedido[]) => {
    if (rows.length > 0) {
      setDetalleSeleccionado(rows[0]);
    } else {
      setDetalleSeleccionado(null);
    }
  };

  type RowModel = FilaCompra & GridValidRowModel;

  // Pasar datos (IdProducto, IdPresentacion y cantidad) de los input a la tablaCompras
  const [nuevaFila, setNuevaFila] = useState<FilaCompra | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [filasCompra, setFilasCompra] = useState<RowModel[]>([]);
  const [totalCompra, setTotalCompra] = useState(0);

  const handleGuardarCompra = () => {
    if (filasCompra.length === 0) {
      toast.error("Debe agregar al menos un producto a la compra");
      return;
    }

    confirmAlert({
      title: "¿Confirmar compra?",
      message: "¿Estás seguro que deseas registrar esta compra?",
      buttons: [
        {
          label: "Sí, confirmar",
          onClick: async () => {
            try {
              // Obtén el total desde el input (o estado)
              const totalInput = document.getElementById(
                "totalCompraInput"
              ) as HTMLInputElement;
              const totalCompra = totalInput
                ? parseFloat(totalInput.value) || 0
                : 0;

              const compra: crearCompra = {
                totalCompra,
                idPedido: pedidoSeleccionado?.idPedido || 0,
                detalleCompra: filasCompra.map((item) => ({
                  cantidad: item.cantidad,
                  idProducto: item.idProducto,
                  idPresentacion: item.idPresentacion,
                })),
              };

              await axios.post(
                "http://localhost:5187/api/Compras/CrearCompra",
                compra
              );

              toast.success("Compra registrada con éxito");
              setFilasCompra([]);
              setPedidoSeleccionado(null);
            } catch (error: any) {
              toast.error("Error al registrar la compra");
              if (error.response?.data?.message) {
                toast.error(error.response.data.message);
              } else {
                toast.error(error.message || "Error inesperado");
              }
            }
          },
        },
        {
          label: "Cancelar",
          onClick: () => toast.info("Registro cancelado"),
        },
      ],
    });
  };

  const handleAgregar = () => {
    if (!detalleSeleccionado || cantidad <= 0) return;

    // Los datos no se pasan si la cantidad está en 0
    const fila = {
      id: randomId(),
      cantidad,
      idProducto: detalleSeleccionado.idProducto,
      idPresentacion: detalleSeleccionado.idPresentacion,
      isNew: true,
    };

    setNuevaFila(fila); // Se enviará a la tabla
    setCantidad(0); // Limpia cantidad después de agregar
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

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 0.95, minWidth: "550px" }}>
          <TablaFiltroPedidos
            AgregarSeleccionado={() => {}}
            productosYaAgregados={[]}
            onSelectSingle={seleccionarPedido}
          />
        </div>

        <div style={{ flex: 1, minWidth: "400px" }}>
          <TablaFiltroDetallePedidos
            AgregarSeleccionado={seleccionarDetalle}
            productosYaAgregados={
              detalleSeleccionado ? [detalleSeleccionado] : []
            }
            pedido={pedidoSeleccionado}
          />
        </div>
      </div>

      <BotonAgregar onClick={handleAgregar} />

      <div
        style={{
          flex: 1,
          minWidth: "300px",
          marginTop: "2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <h3 style={{ textAlign: "center", paddingTop: "25px" }}>
          Datos del Pedido
        </h3>
        <PedidosInput
          pedido={
            pedidoSeleccionado
              ? { idPedido: pedidoSeleccionado.idPedido, total: totalCompra }
              : undefined
          }
          total={totalCompra}
          onTotalChange={setTotalCompra}
        />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: "300px",
          marginTop: "2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <h3 style={{ textAlign: "center", paddingTop: "25px" }}>
          Datos del Detalle del Pedido
        </h3>
        <DetallePedidosInput
          detallePedido={
            detalleSeleccionado
              ? {
                  cantidad: cantidad,
                  idProducto: detalleSeleccionado.idProducto,
                  idPresentacion: detalleSeleccionado.idPresentacion,
                }
              : undefined
          }
          onCantidadChange={setCantidad}
        />
      </div>
      <TablaCompras
        nuevaFila={nuevaFila}
        setRows={setFilasCompra}
        rows={filasCompra}
        onClick={handleGuardarCompra}
      />
      <BotonFinalizarCompra />
    </div>
  );
}

export default Compras;
