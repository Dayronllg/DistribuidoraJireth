import { Routes, Route } from "react-router-dom";
import Login from "./features/Login/pages/Login";

//import AdminInicio from "./features/Inicio/pages/Inicio";
import AdminVentas from "../src/features/Ventas/pages/Admin/AdminVentas";
import NoFoundPage from "./features/NoFoundPage";
import SidebarAdmin from "./features/Inicio/components/SidebarAdmin";
//import AdminPedidos from "./features/Ventas/pages/Admin/AdminPedidos";
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
      <Route path="/admin" element={<SidebarAdmin />}>
        {/* <Route index element={<AdminVentas />} /> Página por defecto */}
        <Route path="ventas" element={<AdminVentas />} />
        <Route path="*" element={<NoFoundPage />} />
      </Route>

      {/* Ruta para usuario */}
      <Route path="/usuario" element={<SidebarAdmin />}>
        {/* <Route index element={<AdminVentas />} /> Página por defecto */}
        <Route path="ventas" element={<AdminVentas />} />
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
