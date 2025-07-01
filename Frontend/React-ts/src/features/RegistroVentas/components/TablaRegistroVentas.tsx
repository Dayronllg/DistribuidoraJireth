import * as React from "react";
import Box from "@mui/material/Box";

import {
  GridRowModes,
  GridRowEditStopReasons,
  DataGrid,
} from "@mui/x-data-grid";
import type {
  GridRowsProp,
  GridRowModesModel,
  GridColDef,
  GridEventListener,
  GridRowModel,
  GridSlotProps,
} from "@mui/x-data-grid";

import { randomId } from "@mui/x-data-grid-generator";
import axios from "axios";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";

type Venta = {
  idVenta: number;
  totalVenta: Number;
  fecha: Date;
  estado: string;
  idUsuario: number;
  idCliente: number;
  detalleVenta: DetalleVentas[] | null;
};

type DetalleVentas = {
  cantidad: number;
  precio: number;
  subTotal: number;
  idVenta: number;
  idProducto: number;
  idPresentacion: number;
};

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
}

// Toolbar de Agregar
function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { setRows, setRowModesModel } = props;

  // Obtener rol de localStorage
  const rol = localStorage.getItem("rol");

  if (rol !== "Administrador") {
    return null; // Así no se renderiza nada de la Toolbar
  }

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, estado: "Realizado", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };
}

export default function TablaRegistroVentas() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Venta>>(
        "http://localhost:5187/api/Ventas/ObtenerVentas",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
      .then((response) => {
        setRows(
          response.data.datos.map((t) => ({
            id: t.idVenta,
            total: t.totalVenta,
            fecha: new Date(t.fecha),
            estado: t.estado,
            idCliente: t.idCliente,
            idUsuario: t.idUsuario,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener Proveedores:", error);
      });
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Leer rol
  const rol = localStorage.getItem("rol");

  // Primero declarar las columnas comunes:
  const baseColumns: GridColDef[] = [
    {
      field: "total",
      headerName: "Total Venta",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "fecha",
      headerName: "Fecha",
      headerAlign: "center",
      align: "center",
      type: "date",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "estado",
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: ["Realizado", "Cancelado"],
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "idCliente",
      headerName: "ID Cliente",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: true,
    },
    {
      field: "idUsuario",
      headerName: "ID Usuario",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: false,
    },
  ];

  // Después de forma condicional se renderiza o no la columna de actions:
  const columns: GridColDef[] = baseColumns;

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        // ml: -22,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
        showToolbar
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#007bff",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "1rem",
          },
          "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnTitle": {
            padding: "0.5rem",
          },
        }}
      />
    </Box>
  );
}
