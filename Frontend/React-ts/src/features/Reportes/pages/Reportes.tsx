import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@mui/material/Button";

type DetalleVentasReportesDto = {
  idVenta: number;
  fechaVenta: string;
  clienteNombre: string;
  productoNombre: string;
  presentacionNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

type VentasPorDiaDto = {
  fecha: string;
  cantidadVentas: number;
  montoTotal: number;
};

type ReporteDeVentsDto = {
  totalVentas: number;
  totalMonto: number;
  montoPromedioPorVenta: number;
  ventaMaxima: number;
  ventaMinima: number;
  totalClientesUnicos: number;
  ventasPorDia: VentasPorDiaDto[];
  detalles: DetalleVentasReportesDto[];
};

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [reporte, setReporte] = useState<ReporteDeVentsDto | null>(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const filasPorPagina = 10;
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor ingresa ambas fechas.");
      return;
    }
    if (fechaFin < fechaInicio) {
      setError("La fecha fin no puede ser anterior a la fecha inicio.");
      return;
    }
    setError(null);
    setCargando(true);
    try {
      const res = await axios.post<ReporteDeVentsDto>(
        "http://localhost:5187/api/Reportes/CrearReporteDEVentas",
        {
          fechaInicio,
          fechaFin,
        }
      );
      setReporte(res.data);
      setPaginaActual(0);
    } catch (err) {
      console.error(err);
      setError("Error al cargar reporte.");
    } finally {
      setCargando(false);
    }
  };

  const totalPaginas = reporte
    ? Math.ceil(reporte.detalles.length / filasPorPagina)
    : 0;

  const filasPagina = reporte
    ? reporte.detalles.slice(
        paginaActual * filasPorPagina,
        paginaActual * filasPorPagina + filasPorPagina
      )
    : [];

  const irAPagina = (num: number) => {
    if (num >= 0 && num < totalPaginas) setPaginaActual(num);
  };

  const descargarPDF = () => {
    if (!reporte) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
    });

    doc.setFontSize(16);
    doc.text("Reporte General de Ventas", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Desde: ${fechaInicio}   Hasta: ${fechaFin}`, 15, 25);

    doc.text(`Total Ventas: ${reporte.totalVentas}`, 15, 32);
    doc.text(`Total Monto: C$ ${reporte.totalMonto.toFixed(2)}`, 15, 38);
    doc.text(
      `Promedio por Venta: C$ ${reporte.montoPromedioPorVenta.toFixed(2)}`,
      15,
      44
    );
    doc.text(`Venta Máxima: C$ ${reporte.ventaMaxima.toFixed(2)}`, 15, 50);
    doc.text(`Venta Mínima: C$ ${reporte.ventaMinima.toFixed(2)}`, 15, 56);
    doc.text(`Clientes Únicos: ${reporte.totalClientesUnicos}`, 15, 62);

    autoTable(doc, {
      startY: 70,
      head: [["Fecha", "Cantidad Ventas", "Monto Total"]],
      body: reporte.ventasPorDia.map((v) => [
        v.fecha,
        v.cantidadVentas,
        `C$ ${v.montoTotal.toFixed(2)}`,
      ]),
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [52, 152, 219], halign: "center" },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable
        ? (doc as any).lastAutoTable.finalY + 10
        : 110,
      head: [
        [
          "Venta",
          "Fecha",
          "Cliente",
          "Producto",
          "Presentación",
          "Cantidad",
          "Precio Unit",
          "Subtotal",
        ],
      ],
      body: reporte.detalles.map((d) => [
        d.idVenta,
        d.fechaVenta,
        d.clienteNombre,
        d.productoNombre,
        d.presentacionNombre,
        d.cantidad,
        `C$ ${d.precioUnitario.toFixed(2)}`,
        `C$ ${d.subtotal.toFixed(2)}`,
      ]),
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [39, 174, 96], halign: "center" },
      didDrawPage: (pageData) => {
        const pageNumber = (doc.internal as any).getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Página ${pageNumber}`, 200, 280, { align: "right" });
      },
    });

    doc.save(`ReporteVentas_${fechaInicio}_a_${fechaFin}.pdf`);
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
      <h2>Reporte de Ventas</h2>

      <div style={{ marginBottom: 20, display: "flex", gap: 15 }}>
        <div>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <Button
          sx={{
            marginTop: "15px",
            color: "white",
            fontWeight: "bold",
            fontSize: "15px",
            width: "100%",
            backgroundColor: "#007bff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
          onClick={cargarReporte}
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Cargar Reporte"}
        </Button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {reporte && (
        <>
          <div style={{ backgroundColor: "#121212", marginBottom: 10 }}>
            <p>
              <b>Total Ventas:</b> {reporte.totalVentas} — <b>Total Monto:</b>{" "}
              C$ {reporte.totalMonto.toFixed(2)}
            </p>
            <p>
              <b>Promedio por Venta:</b> C${" "}
              {reporte.montoPromedioPorVenta.toFixed(2)} — <b>Venta Máxima:</b>{" "}
              C$ {reporte.ventaMaxima.toFixed(2)} — <b>Venta Mínima:</b> C${" "}
              {reporte.ventaMinima.toFixed(2)} — <b>Clientes Únicos:</b>{" "}
              {reporte.totalClientesUnicos}
            </p>
          </div>
          <div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 15,
                backgroundColor: "#1b2631",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#000", color: "white" }}>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Venta
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Fecha
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Cliente
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Producto
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Presentación
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Cantidad
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Precio Unitario
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {filasPagina.map((item, i) => (
                  <tr key={`${item.idVenta}-${i}`}>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {item.idVenta}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {new Date(item.fechaVenta).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>
                      {item.clienteNombre}
                    </td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>
                      {item.productoNombre}
                    </td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>
                      {item.presentacionNombre}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {item.cantidad}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      C$ {item.precioUnitario.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      C$ {item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginBottom: 40,
            }}
          >
            <Button
              sx={{
                marginTop: "15px",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
                width: "100%",
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 0}
            >
              Anterior
            </Button>
            <span>
              Página {paginaActual + 1} de {totalPaginas}
            </span>
            <Button
              sx={{
                marginTop: "15px",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
                width: "100%",
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual + 1 === totalPaginas}
            >
              Siguiente
            </Button>
          </div>

          <Button
            sx={{
              marginTop: "15px",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              width: "100%",
              backgroundColor: "#007bff",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
            onClick={descargarPDF}
          >
            Descargar PDF Completo
          </Button>
        </>
      )}
    </div>
  );
}
