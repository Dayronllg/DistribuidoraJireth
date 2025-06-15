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
  Cookie,
  Engineering,
  Equalizer,
  Groups,
  LocalAtm,
  LocalShipping,
  LunchDining,
  Payment,
  PermMedia,
  PointOfSale,
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
        {/* <PageContainer> */}
        <div style={{ padding: "3rem" }}>
          <Outlet />
        </div>
        {/* </PageContainer> */}
      </DashboardLayout>
    </AppProvider>
  );
}
