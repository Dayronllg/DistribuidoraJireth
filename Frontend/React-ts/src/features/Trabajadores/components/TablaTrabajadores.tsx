import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

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
  GridValidRowModel,
} from "@mui/x-data-grid";

import {
  randomId
 
} from "@mui/x-data-grid-generator";
import axios from "axios";

export interface PaginacionResultado<T> {
  datos: T[];
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  tamanioPagina: number;
}

export interface Trabajador {
  idTrabajador: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  estado: "Contratado" | "Despedido";
}

export function mapRowToTrabajador(row: GridRowModel): Trabajador {
  return {
    idTrabajador: row.idTrabajador,
    primerNombre: row.primerNombre,
    segundoNombre: row.segundoNombre,
    primerApellido: row.primerApellido,
    segundoApellido: row.segundoApellido,
    telefono: row.telefono,
    estado: row.estado, // si tienes este campo
  };
}

const API_BASE='http://localhost:5187/api'

export const crearTrabajador = async (nuevo: Trabajador) => {
  try {
    const response = await axios.post(`${API_BASE}/Trabajadores/CrearTrabajador`, nuevo);
    return response.data;
  } catch (error) {
    console.error("Error al crear trabajador", error);
    throw error;
  }
};


export async function actualizarTrabajador(trabajador: Trabajador): Promise<Trabajador> {
  try {
    const response = await axios.put<Trabajador>(
      `${API_BASE}/Trabajadores/ActualizarTrabajador`,
      trabajador
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar trabajador:", error);
    throw error; // Puedes lanzar un error más específico si querés
  }
}

const eliminarTrabajador = async (id: number) => {
  try {
    const response = await axios.put(`${API_BASE}/Trabajadores/BajaTrabajadores`,null,{params:{id:id}} 
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar (inhabilitar) el trabajador:', error);
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


export default function TablaRegistroVentas() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Trabajador>>(
        "http://localhost:5187/api/Trabajadores/ObtenerTrabajadores",
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
            id: t.idTrabajador,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener trabajadores:", error);
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
    console.log(id);
    await eliminarTrabajador(Number(id));
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
let updatedRow: { id: number; isNew: boolean } = { id: newRow.id, isNew: false };

  if (newRow.isNew) {
    const trabajadorCreado = await crearTrabajador(mapRowToTrabajador(newRow));

    updatedRow = {
      ...newRow,
      ...trabajadorCreado,
      id: trabajadorCreado.idTrabajador, 
      isNew: false,
    };
  } else {
    const trabajadorActualizado = await actualizarTrabajador(mapRowToTrabajador(newRow));
    updatedRow = {
      ...trabajadorActualizado,
      id: trabajadorActualizado.idTrabajador, 
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
      field: "idTrabajador",
      headerName: "ID Trabajador",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: true,
    },
    {
      field: "primerNombre",
      headerName: "Primer Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "segundoNombre",
      headerName: "Segundo Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "primerApellido",
      headerName: "Primer Apellido",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "segundoApellido",
      headerName: "Segundo Apellido",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "telefono",
      headerName: "Telefono",
      headerAlign: "center",
      align: "center",
      type: "string",
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
      valueOptions: ["Acitvo", "Inactivo"],
      flex: 0.7,
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
