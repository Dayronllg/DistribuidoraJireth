import TablaTrabajadores from "../components/TablaTrabajadores";

function Trabajadores() {
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
        Trabajadores
      </h2>
      <TablaTrabajadores />
    </div>
  );
}

export default Trabajadores;
