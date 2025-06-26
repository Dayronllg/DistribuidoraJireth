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
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";

import axios from "axios";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";
import { toast } from "react-toastify";

type Presentacion = {
  idPresentacion: number;
  nombre: string;
  precio: number;
  inventario: number;
  estado: string;
  idProductos: number;
};

export type FilaProductos = {
  id: number;
  nombre: string;
  estado: string;
};

type Props = {
  producto: FilaProductos | null;
};

export function mapRowToPresentacion(row: GridRowModel): Presentacion {
  return {
    idPresentacion: row.idPresentacion,
    nombre: row.nombre,
    precio: row.precio,
    inventario: row.inventario,
    estado: row.estado,
    idProductos: row.idProductos,
  };
}

const API_BASE = "http://localhost:5187/api";

export const crearPresentacion = async (nuevo: Presentacion) => {
  try {
    const response = await axios.post(
      `${API_BASE}/Presentaciones/CrearPresentacion`,
      nuevo
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear Presentacion", error);
    throw error;
  }
};

export async function actualizarPresentacion(
  Presentacion: Presentacion
): Promise<Presentacion> {
  try {
    const response = await axios.put<Presentacion>(
      `${API_BASE}/Presentaciones/ActualizarPresentacion`,
      Presentacion
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar Presentacion:", error);
    throw error; // Puedes lanzar un error más específico si querés
  }
}

const eliminarPresentacion = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_BASE}/Presentaciones/BajaPresentaciones`,
      null,
      { params: { id: id } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar (inhabilitar) el Presentacion:", error);
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

export default function TablaRegistroVentas({ producto }: Props) {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Presentacion>>(
        "http://localhost:5187/api/Presentaciones/ObtenerPresentaciones",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
      .then((response) => {
        const filas = response.data.datos.map((p) => ({
          id: p.idPresentacion,
          idPresentacion: p.idPresentacion,
          nombre: p.nombre,
          inventario: p.inventario,
          precio: p.precio,
          estado: p.estado,
          idProductos: p.idProductos,
        }));
        setRows(filas);
      })
      .catch((error) => {
        console.error("Error al obtener Presentacions:", error);
      });
  }, []);

  React.useEffect(() => {
    if (!producto) return;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.isNew
          ? {
              ...row,
              idProductos: producto.id,
            }
          : row
      )
    );
  }, [producto]);

  //Toolbar de Agregar
  function EditToolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel } = props;

    // Obtener rol de localStorage
    const rol = localStorage.getItem("rol");

    if (rol !== "Administrador") {
      return null; // Así no se renderiza nada de la Toolbar
    }

    const handleClick = () => {
      if (!producto) {
        toast.warning(
          "Debe seleccionar un producto antes de agregar una presentacion."
        );
        return;
      }
      const id = randomId();
      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          nombre: "",
          precio: 1,
          inventario: 1,
          estado: "Activo",
          idProductos: producto.id, // ✅ Aquí estás pasando el ID
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "nombre" },
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
    setRows(rows.filter((row) => row.id !== id));
    await eliminarPresentacion(Number(id));
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
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#\-]{1,50}$/;

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
          `${nombreCampo} solo debe contener letras, numeros y espacios (máximo 50 caracteres).`
        );
      }
    };

    try {
      // 🔒 Validación de nombre de la presentacion
      validarCampoTextoObligatorio(newRow.nombre, "Nombre");

      if (newRow.precio <= 0) {
        throw new Error("El precio debe ser mayor que 0.");
      }
      if (newRow.inventario <= 0) {
        throw new Error("El inventario debe ser mayor que 0.");
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }

    let updatedRow: {
      id: number;
      idPresentacion: number;
      isNew: boolean;
      nombre: string;
      precio: number;
      inventario: number;
      idProductos: number;
    } = {
      id: newRow.id,
      idPresentacion: newRow.idPresentacion,
      nombre: newRow.nombre,
      precio: newRow.precio,
      inventario: newRow.inventario,
      idProductos: newRow.idProductos,
      isNew: false,
    };

    if (newRow.isNew) {
      if (!producto) {
        toast.warning("Tiene que seleccionar un producto");
        return;
      }
      if (producto !== null) {
        const PresentacionCreado = await crearPresentacion(
          mapRowToPresentacion(newRow)
        );
        updatedRow = {
          ...newRow,
          ...PresentacionCreado,
          id: PresentacionCreado.idPresentacion,
          isNew: false,
        };
      }
    } else {
      const PresentacionActualizado = await actualizarPresentacion(
        mapRowToPresentacion(newRow)
      );
      updatedRow = {
        ...PresentacionActualizado,
        id: PresentacionActualizado.idPresentacion,
        nombre: PresentacionActualizado.nombre,
        precio: PresentacionActualizado.precio,
        inventario: PresentacionActualizado.inventario,
        idProductos: PresentacionActualizado.idProductos,
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
    console.log(updatedRow);
  };
  //let updatedRow = { ...newRow, isNew: false };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Leer rol
  const rol = localStorage.getItem("rol");

  // Primero declarar las columnas comunes:
  const baseColumns: GridColDef[] = [
    {
      field: "idPresentacion",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 50,
      editable: false,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 1.1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "precio",
      headerName: "Precio",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.7,
      minWidth: 100,
      editable: true,
    },
    {
      field: "inventario",
      headerName: "Inventario",
      headerAlign: "center",
      align: "center",
      type: "number",
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
      flex: 0.8,
      minWidth: 150,
      editable: true,
    },
    {
      field: "idProductos",
      headerName: "ID Productos",
      headerAlign: "center",
      align: "center",
      type: "number",
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
