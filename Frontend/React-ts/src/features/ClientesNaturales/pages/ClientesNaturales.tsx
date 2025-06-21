import TablaClientesNaturales from "../components/TablaClientesNaturales";

function ClientesNaturales() {
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
        Clientes Naturales
      </h2>
      <TablaClientesNaturales />
    </div>
  );
}

export default ClientesNaturales;
