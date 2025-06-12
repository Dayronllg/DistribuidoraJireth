import { Routes, Route } from "react-router-dom";
import Login from "./features/Login/pages/Login";
import GestionarVentas from "./features/GestionarVentas/pages/GestionarVentas";
import NoFoundPage from "./features/NoFoundPage";
import Sidebar from "./features/Inicio/components/Sidebar";
import Pedidos from "./features/Pedidos/pages/Pedidos";
import Compras from "./features/Compras/pages/Compras";
import RegistroVentas from "./features/RegistroVentas/pages/RegistroVentas";
//import ProtectedRoute from "./features/Login/ProtectedRoute";

// {<ProtectedRoute allowedRoles={["admin"]}>
// <DashboardLayout/>
// </ProtectedRoute>}
export default function App() {
  return (
    <Routes>
      {/* Ruta principal de Login */}
      <Route path="/" element={<Login />}></Route>

      {/* Ruta para admin */}
      <Route path="/Administrador" element={<Sidebar />}>
        {/* <Route index element={<AdminVentas />} /> Página por defecto */}
        <Route path="gestionarVentas" element={<GestionarVentas />} />
        <Route path="registroVentas" element={<RegistroVentas />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="compras" element={<Compras />} />
        <Route path="*" element={<NoFoundPage />} />
      </Route>

      {/* Ruta para usuario */}
      <Route path="/Usuario" element={<Sidebar />}>
        {/* <Route index element={<AdminVentas />} /> Página por defecto */}
        <Route path="gestionarVentas" element={<GestionarVentas />} />
        <Route path="registroVentas" element={<RegistroVentas />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="compras" element={<Compras />} />
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
  );
}
