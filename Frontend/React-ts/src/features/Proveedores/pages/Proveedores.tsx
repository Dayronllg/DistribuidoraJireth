import TablaProveedores from "../components/TablaProveedores";

function Proveedores() {
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
        Proveedores
      </h2>
      <TablaProveedores />
    </div>
  );
}

export default Proveedores;
