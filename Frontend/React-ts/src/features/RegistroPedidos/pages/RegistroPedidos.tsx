import { useState } from "react";
import TablaFiltroPedidos from "../components/TablaFiltroPedidos";
import TablaFiltroDetallePedidos from "../components/TablaFiltroDetallePedidos";
import type { GridValidRowModel } from "@mui/x-data-grid/models";
import { toast } from "react-toastify";

export type FilaPedidos = {
  idPedido: number;
  fecha: Date;
  ruc: string;
  estado: string;
  idusuario: number;
};

export type FilaDetallePedido = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idPedido: number;
  idProducto: number;
  nombreProducto: string;
  idPresentacion: number;
  nombrePresentacion: string;
};

export interface FilaCompra {
  id: string;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
  idPresentacion: number;
  nombrePresentacion: string;
  isNew: boolean;
}

export type RowModel = FilaCompra & GridValidRowModel;

function GestionarCompras() {
  // Seleccionar el Pedido
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<FilaPedidos | null>(null);

  const seleccionarPedido = (pedido: FilaPedidos) => {
    setPedidoSeleccionado(pedido);
    setDetalleSeleccionado(null);
  };

  // Seleccionar el detallePedido
  let [detalleSeleccionado, setDetalleSeleccionado] =
    useState<FilaDetallePedido | null>(null);

  const seleccionarDetalle = (rows: FilaDetallePedido[]) => {
    if (rows.length > 0) {
      setDetalleSeleccionado(rows[0]);
    } else {
      setDetalleSeleccionado(null);
    }
  };

  // Pasar datos (IdProducto, IdPresentacion y cantidad) de los input a la tablaCompras
  const [nuevaFila, setNuevaFila] = useState<FilaCompra | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [filasCompra, setFilasCompra] = useState<RowModel[]>([]);
  const [totalCompra, setTotalCompra] = useState(0);

  // VALIDACIONES
  const handleAgregar = () => {
    if (!pedidoSeleccionado || !detalleSeleccionado) {
      toast.error(
        "Debe seleccionar un pedido y su respectivo detalle del pedido"
      );
      return;
    }
    if (totalCompra <= 0) {
      toast.error("El Total no puede ser 0 o negativo");
      return;
    }
    if (cantidad <= 0) {
      toast.error("La cantidad no puede ser 0 o negativa");
      return;
    }

    if (!detalleSeleccionado || cantidad <= 0) return;

    // Los datos no se pasan si la cantidad está en 0
    const fila = {
      id: detalleSeleccionado.idDetalle,
      cantidad,
      idProducto: detalleSeleccionado.idProducto,
      nombreProducto: detalleSeleccionado.nombreProducto,
      idPresentacion: detalleSeleccionado.idPresentacion,
      nombrePresentacion: detalleSeleccionado.nombrePresentacion,
      isNew: true,
    };

    setNuevaFila(fila); // Se enviará a la tabla
    setCantidad(0); // Limpia cantidad después de agregar
    setDetalleSeleccionado(null);
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
        Registro de Pedidos
      </h2>

      <div style={{ flex: 0.95, minWidth: "1200px", marginBottom: "30px" }}>
        <TablaFiltroPedidos
          AgregarSeleccionado={() => {}}
          productosYaAgregados={[]}
          onSelectSingle={seleccionarPedido}
          bloquearCambioSeleccion={filasCompra.length > 0}
        />
      </div>

      <div style={{ flex: 1, minWidth: "1200px" }}>
        <TablaFiltroDetallePedidos
          AgregarSeleccionado={seleccionarDetalle}
          productosYaAgregados={
            detalleSeleccionado ? [detalleSeleccionado] : []
          }
          pedido={pedidoSeleccionado}
          busquedaIDPedido={filasCompra}
        />
      </div>
    </div>
  );
}

export default GestionarCompras;
