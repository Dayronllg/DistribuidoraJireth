import {
  DataGrid,
  Toolbar,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
} from "@mui/x-data-grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const StyledQuickFilter = styled(QuickFilter)({
  marginLeft: "auto",
});

function CustomToolbar() {
  return (
    <Toolbar>
      <StyledQuickFilter expanded>
        <QuickFilterControl
          render={({ ref, ...other }) => (
            <TextField
              {...other}
              sx={{ width: 260 }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: other.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...other.slotProps?.input,
                },
                ...other.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

import type { GridColDef } from "@mui/x-data-grid";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  estado: string;
  idMarca: number;
};

const columns: GridColDef<Producto>[] = [
  {
    field: "id",
    headerName: "ID",
    type: "string",
    width: 70,
    flex: 0.5,
  },
  {
    field: "nombre",
    headerName: "Nombre",
    type: "string",
    width: 150,
    flex: 2,
  },
  {
    field: "precio",
    headerName: "Precio",
    type: "number",
    width: 100,
    flex: 1,
  },
  {
    field: "cantidad",
    headerName: "Cantidad",
    type: "number",
    width: 100,
    flex: 1,
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    type: "number",
    flex: 1,
  },
  {
    field: "idMarca",
    headerName: "ID Marca",
    width: 100,
    type: "number",
    flex: 1,
  },
];
const rows = [
  {
    id: 1,
    nombre: "Chocolate",
    precio: 2.5,
    cantidad: 100,
    estado: "Activo",
    idMarca: 10,
  },
];

export default function GridPersistentQuickFilter() {
  return (
    <div style={{ height: 400, width: "60%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        loading={false}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
