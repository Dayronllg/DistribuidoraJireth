import TablaClientesJuridicos from "../components/TablaClientesJuridicos";

function ClientesJuridicos() {
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
        Clientes Juridicos
      </h2>
      <TablaClientesJuridicos />
    </div>
  );
}

export default ClientesJuridicos;
