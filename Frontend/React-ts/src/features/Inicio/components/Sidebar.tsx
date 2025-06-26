import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import type { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
//import { PageContainer } from "@toolpad/core/PageContainer";
import {
  AssignmentAdd,
  AttachMoney,
  ContactPhone,
  Cookie,
  DomainAddRounded,
  Engineering,
  Equalizer,
  Groups,
  LocalAtm,
  LocalShipping,
  LunchDining,
  Payment,
  PermMedia,
  PersonAdd,
  PointOfSale,
  ReduceCapacity,
  Store,
} from "@mui/icons-material";

const rol = localStorage.getItem("rol");
console.log(rol);
import { Outlet } from "react-router-dom";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Gestión de Operaciones",
  },
  {
    segment: rol + "",
    title: "Ventas",
    icon: <DashboardIcon />,
    children: [
      {
        segment: "gestionarVentas",
        title: "Gestionar Ventas",
        icon: <AttachMoney />,
      },
      {
        segment: "registroVentas",
        title: "Registro de Ventas",
        icon: <AssignmentAdd />,
      },
    ],
  },
  {
    segment: rol + "/pedidos",
    title: "Pedidos",
    icon: <LocalShipping />,
  },
  {
    segment: rol + "/compras",
    title: "Compras",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Estadísticas",
  },
  {
    title: "Devoluciones",
    icon: <LocalAtm />,
    children: [
      {
        segment: rol + "/devolucionesVentas",
        title: "Devoluciones de Ventas",
        icon: <PointOfSale />,
      },
      {
        segment: rol + "/devolucionesCompras",
        title: "Devoluciones de Compras",
        icon: <Payment />,
      },
    ],
  },
  {
    title: "Productos",
    icon: <LunchDining />,
    children: [
      {
        segment: rol + "/productos",
        title: "Productos",
        icon: <Cookie />,
      },
      {
        segment: rol + "/marcas",
        title: "Marcas",
        icon: <Store />,
      },
      {
        segment: rol + "/presentaciones",
        title: "Presentaciones",
        icon: <PermMedia />,
      },
      {
        segment: rol + "/proveedores",
        title: "Proveedores",
        icon: <DomainAddRounded />,
      },
    ],
  },
  {
    title: "Clientes",
    icon: <PersonAdd />,
    children: [
      {
        segment: rol + "/clientesNaturales",
        title: "Clientes Naturales",
        icon: <ReduceCapacity />,
      },
      {
        segment: rol + "/clientesJuridicos",
        title: "Clientes Juridicos",
        icon: <ContactPhone />,
      },
    ],
  },
  ...(rol === "Administrador" //|| rol === "Usuario"
    ? [
        {
          segment: rol + "/usuarios",
          title: "Usuarios",
          icon: <Groups />,
        },
        {
          segment: rol + "/trabajadores",
          title: "Trabajadores",
          icon: <Engineering />,
        },
        {
          segment: rol + "/reportes",
          title: "Reportes",
          icon: <Equalizer />,
        },
      ]
    : []),
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
//import { useLocation, useNavigate } from "react-router-dom";
//import type { Router } from "@toolpad/core";
export default function SidebarAdmin() {
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    window.location.href = "/"; // o la ruta de login
  };

  //   const location = useLocation();
  // const navigateRR = useNavigate(); // navigate original de React Router

  // // Adaptamos para cumplir con el tipo exacto que espera Toolpad
  // const router: Router = {
  //   pathname: location.pathname,
  //   searchParams: new URLSearchParams(location.search),
  //   navigate: (url: string) => {
  //     // Aseguramos que solo se pase un string
  //     navigateRR(url);
  //   },
  // };
  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        title: "Distribuidora Jireh",
      }}
      //router={router}
    >
      <DashboardLayout>
        <div style={{ display: "flex", height: "100%" }}>
          {/* Contenedor principal */}
          <div style={{ flex: 1, padding: "3rem" }}>
            <Outlet />
          </div>

          {/* Botón fijo dentro del sidebar */}
          <div
            style={{
              position: "fixed",
              left: "1rem",
              bottom: "1rem",
              zIndex: 9999,
            }}
          >
            <button
              onClick={cerrarSesion}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={
                (e) => (e.currentTarget.style.backgroundColor = "#0056b3") // Azul más oscuro al pasar el mouse
              }
              onMouseOut={
                (e) => (e.currentTarget.style.backgroundColor = "#007bff") // Vuelve al color original
              }
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}
