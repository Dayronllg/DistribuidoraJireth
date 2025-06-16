import TablaPresentaciones from "../components/TablaPresentaciones";

function Presentaciones() {
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
        Presentaciones
      </h2>
      <TablaPresentaciones />
    </div>
  );
}

export default Presentaciones;
