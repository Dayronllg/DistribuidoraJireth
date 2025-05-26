import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import type { Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
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

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "ventas",
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
    title: "Analytics",
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

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props: any) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            <Grid size={5} />
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid size={4}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={8}>
              <Skeleton height={100} />
            </Grid>

            <Grid size={12}>
              <Skeleton height={150} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>

            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
