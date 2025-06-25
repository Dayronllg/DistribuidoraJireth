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
import { toast } from "react-toastify";

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

import { randomId } from "@mui/x-data-grid-generator";
import axios from "axios";

export interface Cliente {
  idCliente: number;
  direccion: string;
  telefono: string;
  estado: "Activo" | "Inativo";
  clienteNatural: ClienteNatural;
}

export interface ClienteNatural {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}

function mapRowToClienteNatural(row: any): Cliente {
  return {
    idCliente: row.idCliente,
    direccion: row.direccion,
    telefono: row.telefono,
    estado: row.estado as "Activo" | "Inativo",
    clienteNatural: {
      primerNombre: row.primerNombre,
      segundoNombre: row.segundoNombre,
      primerApellido: row.primerApellido,
      segundoApellido: row.segundoApellido,
    },
  };
}

const API_BASE = "http://localhost:5187/api";

export const crearClienteNatural = async (nuevo: Cliente) => {
  try {
    const response = await axios.post(
      `${API_BASE}/ClienteNatural/CrearClienteNatural`,
      nuevo
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear ClienteNatural", error);
    throw error;
  }
};

export async function actualizarClienteNatural(
  ClienteNatural: Cliente
): Promise<Cliente> {
  try {
    const response = await axios.put<Cliente>(
      `${API_BASE}/ClienteNatural/ActualizarClienteNatural`,
      ClienteNatural
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar Cliente Natural:", error);
    throw error; // Puedes lanzar un error más específico si querés
  }
}

const eliminarClienteNatural = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_BASE}/ClienteNatural/BajaClienteNatural`,
      null,
      { params: { id: id } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar (inhabilitar) el ClienteNatural:", error);
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
    setRows((oldRows) => [...oldRows, { id, estado: "Activo", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "direccion" },
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

export default function TablaClientesNaturales() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Cliente>>(
        "http://localhost:5187/api/ClienteNatural/ObtenerClienteNaturales",
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
            id: t.idCliente,
            primerNombre: t.clienteNatural.primerNombre,
            segundoNombre: t.clienteNatural.segundoNombre,
            primerApellido: t.clienteNatural.primerApellido,
            segundoApellido: t.clienteNatural.segundoApellido,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener ClienteNatural:", error);
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
    await eliminarClienteNatural(Number(id));
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

    // VALIDACIONES
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/;

    const validarCampoTextoObligatorio = (
      valor: string,
      nombreCampo: string
    ) => {
      const texto = valor?.trim();

      if (!texto) {
        throw new Error(`${nombreCampo} no puede estar vacío.`);
      }

      if (!soloLetrasRegex.test(texto)) {
        throw new Error(
          `${nombreCampo} solo debe contener letras y espacios (máximo 30 caracteres).`
        );
      }
    };

    const validarDireccion = (valor: string) => {
      const texto = valor?.trim();

      if (!texto) {
        throw new Error("El campo Dirección no puede estar vacío.");
      }

      if (texto.length > 100) {
        throw new Error("La Dirección no puede exceder los 100 caracteres.");
      }

      const direccionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]+$/;

      if (!direccionRegex.test(texto)) {
        throw new Error(
          "La Dirección solo debe contener letras, números y espacios."
        );
      }
    };

    const validarCampoTextoOpcional = (valor: string, nombreCampo: string) => {
      const texto = valor?.trim();

      if (texto && !soloLetrasRegex.test(texto)) {
        throw new Error(
          `${nombreCampo} solo debe contener letras y espacios (máximo 30 caracteres).`
        );
      }
    };

    // 🔒 Validación de nombres y apellidos
    try {
      validarCampoTextoObligatorio(newRow.primerNombre, "Primer Nombre");
      validarCampoTextoOpcional(newRow.segundoNombre, "Segundo Nombre");
      validarCampoTextoObligatorio(newRow.primerApellido, "Primer Apellido");
      validarCampoTextoOpcional(newRow.segundoApellido, "Segundo Apellido");

      // 🔒 Validación del teléfono
      const telefono = newRow.telefono?.toString().trim();

      if (!telefono) {
        throw new Error("El campo Teléfono no puede estar vacío.");
      }

      if (!/^\d+$/.test(telefono)) {
        throw new Error("El Teléfono solo debe contener números.");
      }

      if (telefono.length !== 8) {
        throw new Error("El Teléfono debe tener exactamente 8 dígitos.");
      }

      // 🔒 Validar dirección
      validarDireccion(newRow.direccion);
    } catch (error: any) {
      toast.error(error.message); // o toast.error(error.message)
      throw error;
    }

    let updatedRow: {
      id: number;
      isNew: boolean;
      primerNombre: string;
      segundoNombre: string;
      primerApellido: string;
      segundoApellido: string;
    } = {
      id: newRow.id,
      isNew: false,
      primerNombre: newRow.primerNombre,
      segundoNombre: newRow.segundoNombre,
      primerApellido: newRow.primerApellido,
      segundoApellido: newRow.segundoApellido,
    };

    if (newRow.isNew) {
      const clienteNaturalCreado = await crearClienteNatural(
        mapRowToClienteNatural(newRow)
      );

      updatedRow = {
        ...newRow,
        ...clienteNaturalCreado,
        id: clienteNaturalCreado.idCliente,
        /*primerNombre:clienteNaturalCreado.primerNombre,
       segundoNombre:clienteNaturalCreado.segundoNombre,
       primerApellido:clienteNaturalCreado.primerApellido,
       segundoApellido:clienteNaturalCreado.segundoApellido,*/
        isNew: false,
      };
    } else {
      const clienteNaturalActualizado = await actualizarClienteNatural(
        mapRowToClienteNatural(newRow)
      );
      updatedRow = {
        ...clienteNaturalActualizado,
        id: clienteNaturalActualizado.idCliente,
        primerNombre: clienteNaturalActualizado.clienteNatural.primerNombre,
        segundoNombre: clienteNaturalActualizado.clienteNatural.segundoNombre,
        primerApellido: clienteNaturalActualizado.clienteNatural.primerApellido,
        segundoApellido:
          clienteNaturalActualizado.clienteNatural.segundoApellido,
        isNew: false,
      };
    }

    // Actualizás las filas del grid
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
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
      field: "idCliente",
      headerName: "ID Cliente",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.7,
      minWidth: 50,
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
      field: "telefono",
      headerName: "Telefono",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 100,
      editable: true,
    },
    {
      field: "estado",
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: ["Activo", "Inactivo"],
      flex: 0.7,
      minWidth: 100,
      editable: true,
    },
    /* {
      field: "idClienteNatural",
      headerName: "ID Cliente Natural",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.7,
      minWidth: 50,
      editable: true,
    },*/
    {
      field: "primerNombre",
      headerName: "Primer Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "segundoNombre",
      headerName: "Segundo Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "primerApellido",
      headerName: "Primer Apellido",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "segundoApellido",
      headerName: "Segundo Apellido",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1,
      minWidth: 100,
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
            flex: 1.5,
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
        onProcessRowUpdateError={() => "errror"}
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
