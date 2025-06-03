import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import type { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import {
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
//import { Sales } from "../../../features/Ventas/pages/Admin/AdminVentas";
//import { NoFoundPage } from "../../../features/NoFoundPage";
//import { PageSkeleton } from "../../layout/Skeleton";
const rol = localStorage.getItem("rol");
console.log(rol);
import { Outlet } from "react-router-dom";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Gestión de Operaciones",
  },
  {
    segment: "admin/ventas",
    title: "Ventas",
    icon: <DashboardIcon />,
  },
  {
    segment: "pedidos",
    title: "Pedidos",
    icon: <LocalShipping />,
  },
  {
    segment: "compras",
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
    segment: "devoluciones",
    title: "Devoluciones",
    icon: <LocalAtm />,
    children: [
      {
        segment: "devolucionVentas",
        title: "Devoluciones de Ventas",
        icon: <PointOfSale />,
      },
      {
        segment: "devolucionCompras",
        title: "Devoluciones de Compras",
        icon: <Payment />,
      },
    ],
  },
  {
    segment: "productos",
    title: "Productos",
    icon: <LunchDining />,
    children: [
      {
        segment: "productos",
        title: "Productos",
        icon: <Cookie />,
      },
      {
        segment: "marcas",
        title: "Marcas",
        icon: <Store />,
      },
      {
        segment: "presentaciones",
        title: "Presentaciones",
        icon: <PermMedia />,
      },
    ],
  },
  ...(rol === "admin"
    ? [
        {
          segment: "usuarios",
          title: "Usuarios",
          icon: <Groups />,
        },
        {
          segment: "trabajadores",
          title: "Trabajadores",
          icon: <Engineering />,
        },
        {
          segment: "reportes",
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
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

// function useDemoRouter(initialPath: string): Router {
//   const [pathname, setPathname] = React.useState(initialPath);

//   const router = React.useMemo(() => {
//     return {
//       pathname,
//       searchParams: new URLSearchParams(),
//       navigate: (path: string | URL) => setPathname(String(path)),
//     };
//   }, [pathname]);

//   return router;
// }

// function useLoadingOnRouteChange(pathname: string) {
//   const [loading, setLoading] = React.useState(false);

//   React.useEffect(() => {
//     setLoading(true);
//     const timeout = setTimeout(() => setLoading(false), 500); // 500ms de "carga"
//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   return loading;
// }

// interface DashboardLayout {
//   window?: Window;
// }

// export default function DashboardLayoutBasic(props: DashboardLayout) {
//   const { window } = props;

//   const router = useDemoRouter("/dashboard");
//   const loading = useLoadingOnRouteChange(router.pathname);

//   const renderPage = () => {
//     switch (router.pathname) {
//       case "/ventas":
//         return <Sales />;
//       default:
//         return <NoFoundPage />;
//     }
//   };
//   return (
//     <AppProvider
//       navigation={NAVIGATION}
//       router={router}
//       theme={demoTheme}
//       window={window}
//     >
//       <DashboardLayout>
//         <PageContainer>
//           {loading ? <PageSkeleton /> : renderPage()}
//         </PageContainer>
//       </DashboardLayout>
//     </AppProvider>
//   );
// }
