import { Routes, Route } from "react-router-dom";
import Login from "./features/Login/pages/Login";
import GestionarVentas from "./features/GestionarVentas/pages/GestionarVentas";
import NoFoundPage from "./features/NoFoundPage";
import Inicio from "./features/Inicio/pages/Inicio";
import Pedidos from "./features/Pedidos/pages/Pedidos";
import Compras from "./features/Compras/pages/Compras";
import RegistroVentas from "./features/RegistroVentas/pages/RegistroVentas";
import DevolucionesVentas from "./features/DevolucionesVentas/pages/DevolucionesVentas";
import DevolucionesCompras from "./features/DevolucionesCompras/pages/DevolucionesCompras";
import Productos from "./features/Productos/pages/Productos";
import Marcas from "./features/Marcas/pages/Marcas";
import Presentaciones from "./features/Presentaciones/pages/Presentaciones";
import Usuarios from "./features/Usuarios/pages/Usuarios";
import Trabajadores from "./features/Trabajadores/pages/Trabajadores";
import Reportes from "./features/Reportes/pages/Reportes";
import ClientesNaturales from "./features/ClientesNaturales/pages/ClientesNaturales";
import ClientesJuridicos from "./features/ClientesJuridicos/pages/ClientesJuridicos";
import Proveedores from "./features/Proveedores/pages/Proveedores";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./App.css";
//import ProtectedRoute from "./features/Login/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// {<ProtectedRoute allowedRoles={["admin"]}>
// <DashboardLayout/>
// </ProtectedRoute>}
export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // También puedes usar "light" o "colored"
        toastStyle={{
          background: "#1f1f1f",
          color: "#fff",
          fontSize: "18px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          border: "1px solid #444",
          padding: "1rem",
        }}
      />

      <Routes>
        {/* Ruta principal de Login */}
        <Route path="/" element={<Login />}></Route>

        {/* Ruta para admin */}
        <Route path="/Administrador" element={<Inicio />}>
          {/* <Route index element={<AdminVentas />} /> Página por defecto */}
          <Route path="gestionarVentas" element={<GestionarVentas />} />
          <Route path="registroVentas" element={<RegistroVentas />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="compras" element={<Compras />} />
          <Route path="devolucionesVentas" element={<DevolucionesVentas />} />
          <Route path="devolucionesCompras" element={<DevolucionesCompras />} />
          <Route path="productos" element={<Productos />} />
          <Route path="marcas" element={<Marcas />} />
          <Route path="presentaciones" element={<Presentaciones />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="trabajadores" element={<Trabajadores />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="clientesNaturales" element={<ClientesNaturales />} />
          <Route path="clientesJuridicos" element={<ClientesJuridicos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="*" element={<NoFoundPage />} />
        </Route>

        {/* Ruta para usuario */}
        <Route path="/Usuario" element={<Inicio />}>
          {/* <Route index element={<AdminVentas />} /> Página por defecto */}
          <Route path="gestionarVentas" element={<GestionarVentas />} />
          <Route path="registroVentas" element={<RegistroVentas />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="compras" element={<Compras />} />
          <Route path="devolucionesVentas" element={<DevolucionesVentas />} />
          <Route path="devolucionesCompras" element={<DevolucionesCompras />} />
          <Route path="productos" element={<Productos />} />
          <Route path="marcas" element={<Marcas />} />
          <Route path="presentaciones" element={<Presentaciones />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="trabajadores" element={<Trabajadores />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="clientesNaturales" element={<ClientesNaturales />} />
          <Route path="clientesJuridicos" element={<ClientesJuridicos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="*" element={<NoFoundPage />} />
        </Route>

        {/*Rutas para Admin*/}
        {/* <Route path="/admin" element={<DashboardLayout />}>
        <Route path="inicio" element={<Inicio />}></Route>
        <Route path="ventas" element={<AdminVentas />} />
        {/* <Route path="pedidos" element={<AdminPedidos />} />}
      </Route> */}

        {/* Rutas para Cliente */}
        {/* <Route path="/cliente" element={<DashboardLayout />}>
        <Route index element={<ClienteInicio />} />
        <Route path="compras" element={<Compras />} />
      </Route>*/}
      </Routes>
    </>
  );
}
