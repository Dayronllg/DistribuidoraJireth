import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";

import {
  GridRowModes,
  Toolbar,
  GridRowEditStopReasons,
  GridActionsCellItem,
  DataGrid,
} from "@mui/x-data-grid";
import type {
  GridRowsProp,
  GridRowModesModel,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridSlotProps,
} from "@mui/x-data-grid";

import {
  randomId
} from "@mui/x-data-grid-generator";
import axios from "axios";

export interface Proveedor {
  ruc: string,
  nombre: string,
  telefono: string,
  direccion: string,
  estado: "Activo" | "Inactivo"
}

export function mapRowToProveedor(row: GridRowModel): Proveedor {
  return {
    ruc: row.ruc,
  nombre: row.nombre,
  telefono: row.telefono,
  direccion: row.direccion,
  estado: row.estado // si tienes este campo
  };
}

const API_BASE='http://localhost:5187/api'

export const crearProveedor = async (nuevo: Proveedor) => {
  try {
    const response = await axios.post(`${API_BASE}/Proveedor/CrearProveedor`, nuevo);
    return response.data;
  } catch (error) {
    console.error("Error al crear Proveedor", error);
    throw error;
  }
};


export async function actualizarProveedor(Proveedor: Proveedor): Promise<Proveedor> {
  try {
    const response = await axios.put<Proveedor>(
      `${API_BASE}/Proveedor/ActualizarProveedor`,
      Proveedor
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar Proveedor:", error);
    throw error; // Puedes lanzar un error más específico si querés
  }
}

const eliminarProveedor = async (id: string) => {
  try {
    const response = await axios.put(`${API_BASE}/Proveedor/BajaProveedor`,null,{params:{ruc:id}} 
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar (inhabilitar) el Proveedor:', error);
    throw error;
  }
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
      { id, name: "", age: "", role: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Agregar">
        <Button
          onClick={handleClick}
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            borderRadius: "10px",
            color: "white",
            backgroundColor: "#007bff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Agregar
        </Button>
      </Tooltip>
    </Toolbar>
  );
}

export default function TablaProveedores() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );


  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Proveedor>>(
        "http://localhost:5187/api/Proveedor/ObtenerProveedores",
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
            ...t,
            id: t.ruc,
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

  const MantenerClickEditar = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const MantenerClickGuardar = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

 const MantenerClickBorrar = (id: GridRowId) => async () => {
     
     await eliminarProveedor(String(id));
     setRows(rows.filter((row) => row.id !== id));
   };

  const MantenerClickCancelar = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    //let updatedRow = { ...newRow, isNew: false };
  let updatedRow: { id: string; isNew: boolean } = { id: newRow.id, isNew: false };
  
    if (newRow.isNew) {
      const ProveedorCreado = await crearProveedor(mapRowToProveedor(newRow));
  
      updatedRow = {
        ...newRow,
        ...ProveedorCreado,
        id: ProveedorCreado.ruc, 
        isNew: false,
      };
    } else {
      const ProveedorActualizado = await actualizarProveedor(mapRowToProveedor(newRow));
      updatedRow = {
        ...ProveedorActualizado,
        id: ProveedorActualizado.ruc, 
        isNew: false
      };
    }
  
    // Actualizás las filas del grid
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === newRow.id ? updatedRow : row
      )
    );
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [newRow.id]: { mode: GridRowModes.View }, // usar el id final
    }));
  
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
      field: "ruc",
      headerName: "RUC",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "telefono",
      headerName: "Telefono",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "direccion",
      headerName: "Direccion",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "estado",
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: ["Activo", "Inactivo"],
      flex: 1,
      minWidth: 150,
      editable: true,
    },
  ];

  // Después de forma condicional se renderiza o no la columna de actions:
  const columns: GridColDef[] =
    rol === "Administrador"
      ? [
          ...baseColumns,
          {
            field: "actions",
            headerName: "Acciones",
            headerAlign: "center",
            align: "center",
            type: "actions",
            flex: 1,
            minWidth: 150,
            cellClassName: "actions",
            getActions: ({ id }) => {
              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={MantenerClickGuardar(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    onClick={MantenerClickCancelar(id)}
                  />,
                ];
              }
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={MantenerClickEditar(id)}
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={MantenerClickBorrar(id)}
                />,
              ];
            },
          },
        ]
      : baseColumns;

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
