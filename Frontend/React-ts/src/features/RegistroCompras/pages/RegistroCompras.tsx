import { useState } from "react";
import TablaFiltroCompras from "../components/TablaFiltroCompras";
import TablaFiltroDetalleCompras from "../components/TablaFiltroDetalleCompras";
import type { GridValidRowModel } from "@mui/x-data-grid/models";
import { toast } from "react-toastify";

// === Tipos actualizados ===

export type FilaCompraTabla = {
  idCompra: number;
  totalCompra: number;
  idPedido: number;
  estado: string;
};

export type FilaDetalleCompra = {
  idDetalle: string;
  cantidadProducto: number;
  estado: string;
  idCompra: number;
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

function RegistroCompras() {
  // Seleccionar la Compra
  const [compraSeleccionada, setCompraSeleccionada] =
    useState<FilaCompraTabla | null>(null);

  const seleccionarCompra = (compra: FilaCompraTabla) => {
    setCompraSeleccionada(compra);
    setDetalleSeleccionado(null);
  };

  // Seleccionar el detalle de la compra
  const [detalleSeleccionado, setDetalleSeleccionado] =
    useState<FilaDetalleCompra | null>(null);

  const seleccionarDetalle = (rows: FilaDetalleCompra[]) => {
    if (rows.length > 0) {
      setDetalleSeleccionado(rows[0]);
    } else {
      setDetalleSeleccionado(null);
    }
  };

  // Datos para la tabla de compras
  const [nuevaFila, setNuevaFila] = useState<FilaCompra | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [filasCompra, setFilasCompra] = useState<RowModel[]>([]);
  const [totalCompra, setTotalCompra] = useState(0);

  const handleAgregar = () => {
    if (!compraSeleccionada || !detalleSeleccionado) {
      toast.error(
        "Debe seleccionar una compra y su respectivo detalle de compra"
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

    const fila: FilaCompra = {
      id: detalleSeleccionado.idDetalle,
      cantidad,
      idProducto: detalleSeleccionado.idProducto,
      nombreProducto: detalleSeleccionado.nombreProducto,
      idPresentacion: detalleSeleccionado.idPresentacion,
      nombrePresentacion: detalleSeleccionado.nombrePresentacion,
      isNew: true,
    };

    setNuevaFila(fila);
    setCantidad(0);
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
        Registro de Compras
      </h2>

      <div style={{ flex: 0.95, minWidth: "1200px", marginBottom: "30px" }}>
        <TablaFiltroCompras onSelectSingle={seleccionarCompra} />
      </div>

      <div style={{ flex: 1, minWidth: "1200px" }}>
        <TablaFiltroDetalleCompras
          compraID={compraSeleccionada?.idCompra || null}
          AgregarSeleccionado={seleccionarDetalle}
          productosYaAgregados={[]} // puedes pasar lo necesario
          busquedaIDCompra={filasCompra}
        />
      </div>
    </div>
  );
}

export default RegistroCompras;
