import TablaMarcas from "../components/TablaMarcas";

function Marcas() {
  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#1b2631",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Marcas</h2>
      <TablaMarcas />
    </div>
  );
}

export default Marcas;
