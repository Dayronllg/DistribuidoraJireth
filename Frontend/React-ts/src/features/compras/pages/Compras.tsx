import { useState } from "react";
import TablaFiltroPedidos from "../components/TablaFiltroPedidos";
import TablaCompras from "../components/TablaCompras";
import DetallePedidosInput from "../components/DetallePedidosInput";
import BotonAgregar from "../components/BotonAgregar";

type FilaPedidos = {
  id: number;
  fecha: Date;
  ruc: number;
  estado: string;
  idusuario: number;
};

function Compras() {
  const [FilasSeleccionadas, setFilasSeleccionadas] = useState<FilaPedidos[]>(
    []
  );

  // Estado para el id del pedido seleccionado vía radio button
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<
    number | null
  >(null);

  // Añadir filas sin duplicados
  const AñadirFilasSeleccionadas = (rows: FilaPedidos[]) => {
    const nuevos = rows.filter(
      (row) => !FilasSeleccionadas.some((r) => r.id === row.id)
    );
    setFilasSeleccionadas((prev) => [...prev, ...nuevos]);
  };

  // Eliminar fila
  const EliminarFilasSeleccionadas = (id: number) => {
    setFilasSeleccionadas((prev) => prev.filter((row) => row.id !== id));
    // Si eliminas el pedido seleccionado, limpia selección
    if (pedidoSeleccionadoId === id) setPedidoSeleccionadoId(null);
  };

  // Editar fila
  const EditarFilaSeleccionada = (editarFila: FilaPedidos) => {
    setFilasSeleccionadas((prev) =>
      prev.map((row) => (row.id === editarFila.id ? editarFila : row))
    );
  };

  // Obtener el pedido seleccionado para enviar al detalle
  const pedidoSeleccionado = FilasSeleccionadas.find(
    (fila) => fila.id === pedidoSeleccionadoId
  );

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
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "500px" }}>
          <TablaFiltroPedidos
            AgregarSeleccionado={AñadirFilasSeleccionadas}
            productosYaAgregados={FilasSeleccionadas}
          />
        </div>
      </div>
      <TablaCompras
        data={FilasSeleccionadas}
        Eliminar={EliminarFilasSeleccionadas}
        Editar={EditarFilaSeleccionada}
        pedidoSeleccionadoId={pedidoSeleccionadoId}
        seleccionarPedido={setPedidoSeleccionadoId}
      />
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          marginTop: "2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <h3 style={{ textAlign: "center", paddingTop: "25px" }}>
          Detalle del Pedido Seleccionado
        </h3>
        {/* Aquí pasamos el pedido seleccionado al detalle */}
        <DetallePedidosInput pedido={pedidoSeleccionado} />
      </div>
      <BotonAgregar />
    </div>
  );
}

export default Compras;
