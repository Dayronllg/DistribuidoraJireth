import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
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
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";

export interface ClienteJ {
  idCliente: number;
  direccion: string;
  telefono: string;
  estado: "Activo" | "Inactivo";
  clienteJuridico: ClienteJuridico;
}

export interface ClienteJuridico {
  ruc: string;
  nombre: string;
}

export function mapRowToClienteJuridico(row: GridRowModel): ClienteJ {
  return {
    idCliente: row.idCliente,
    direccion: row.direccion,
    telefono: row.telefono,
    estado: row.estado,
    clienteJuridico: {
      ruc: row.ruc,
      nombre: row.nombre,
    },
  };
}

const API_BASE = "http://localhost:5187/api";

export const crearClienteJuridico = async (nuevo: ClienteJ) => {
  try {
    const response = await axios.post(
      `${API_BASE}/ClienteJuridico/CrearClienteJuridico`,
      nuevo
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear ClienteJuridico", error);
    throw error;
  }
};

export async function actualizarClienteJuridico(
  ClienteJuridico: ClienteJ
): Promise<ClienteJ> {
  try {
    const response = await axios.put<ClienteJ>(
      `${API_BASE}/ClienteJuridico/ActualizarClienteJuridico`,
      ClienteJuridico
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar Cliente Natural:", error);
    throw error;
  }
}

const eliminarClienteJuridico = async (id: string) => {
  try {
    const response = await axios.put(
      `${API_BASE}/ClienteJuridico/BajaClienteJuridico`,
      null,
      { params: { id: id } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar (inhabilitar) el ClienteJuridico:", error);
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

export default function TablaClientesJuridicos() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<ClienteJ>>(
        "http://localhost:5187/api/ClienteJuridico/ObtenerClienteJuridicoes",
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
            ruc: t.clienteJuridico.ruc,
            nombre: t.clienteJuridico.nombre,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener ClienteJuridico:", error);
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
    //let f = rows.filter((row)=>row.id === id);
    let f = rows.find((row) => row.id === id);
    let Ruc = f?.ruc;
    await eliminarClienteJuridico(String(Ruc));
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

    // 🔒 Validación de nombre
    try {
      validarCampoTextoObligatorio(newRow.nombre, "Nombre");

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

      // 🔒 Validación del RUC
      const ruc = newRow.ruc?.toString().trim();

      if (!ruc) {
        throw new Error("El campo RUC no puede estar vacío.");
      }

      if (!/^\d+$/.test(ruc)) {
        throw new Error("El RUC solo debe contener números.");
      }

      if (ruc.length !== 14) {
        throw new Error("El RUC debe tener exactamente 14 dígitos.");
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
      ruc: string;
      nombre: string;
    } = { id: newRow.id, isNew: false, ruc: newRow.ruc, nombre: newRow.nombre };

    if (newRow.isNew) {
      const ClienteJuridicoCreado = await crearClienteJuridico(
        mapRowToClienteJuridico(newRow)
      );

      updatedRow = {
        ...newRow,
        ...ClienteJuridicoCreado,
        id: ClienteJuridicoCreado.idCliente,

        isNew: false,
      };
    } else {
      const ClienteJuridicoActualizado = await actualizarClienteJuridico(
        mapRowToClienteJuridico(newRow)
      );
      updatedRow = {
        ...ClienteJuridicoActualizado,
        id: ClienteJuridicoActualizado.idCliente,
        isNew: false,
        ruc: ClienteJuridicoActualizado.clienteJuridico.ruc,
        nombre: ClienteJuridicoActualizado.clienteJuridico.nombre,
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
    {
      field: "ruc",
      headerName: "RUC",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.7,
      minWidth: 50,
      editable: true,
    },
    {
      field: "nombre",
      headerName: "Nombre",
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
