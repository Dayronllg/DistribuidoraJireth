import { useState } from "react";
import TablaFiltroPedidos from "../components/TablaFiltroPedidos";
import TablaFiltroDetallePedidos from "../components/TablaFiltroDetallePedidos";
import PedidosInput from "../components/PedidosInput";
import DetallePedidosInput from "../components/DetallePedidosInput";
import BotonAgregar from "../components/BotonAgregar";
import TablaCompras from "../components/TablaCompras";

export type FilaPedidos = {
  idPedido: number;
  fecha: Date;
  ruc: number;
  estado: string;
  idusuario: number;
};

export type FilaDetallePedido = {
  idDetalle: number;
  cantidadProducto: number;
  estado: string;
  idPedido: number;
  idProducto: number;
  idPresentacion: number;
};

export type FilaCompra = {
  id: number;
  cantidad: number;
  idProducto: number;
  idPresentacion: number;
};

function Compras() {
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<FilaPedidos | null>(null);
  const [detalleSeleccionado, setDetalleSeleccionado] =
    useState<FilaDetallePedido | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [compras, setCompras] = useState<FilaCompra[]>([]);

  const seleccionarPedido = (pedido: FilaPedidos) => {
    setPedidoSeleccionado(pedido);
    setDetalleSeleccionado(null);
  };

  const seleccionarDetalle = (rows: FilaDetallePedido[]) => {
    if (rows.length > 0) {
      setDetalleSeleccionado(rows[0]);
    } else {
      setDetalleSeleccionado(null);
    }
  };

  const handleAgregar = () => {
    if (!detalleSeleccionado || cantidad <= 0) return;

    const nuevaFila: FilaCompra = {
      id: Date.now(),
      cantidad,
      idProducto: detalleSeleccionado.idProducto,
      idPresentacion: detalleSeleccionado.idPresentacion,
    };

    setCompras((prev) => [...prev, nuevaFila]);
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
              ? { idPedido: pedidoSeleccionado.idPedido, total: 0 }
              : undefined
          }
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
    </div>
  );
}

export default Compras;
