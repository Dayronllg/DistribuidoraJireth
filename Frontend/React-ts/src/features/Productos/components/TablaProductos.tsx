import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
//import type {Props} from "../../Productos/components/ProductoInput"
//import type FilaProductos from "../../Productos/components/ProductoInput"

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

export type FilaMarcas = {
  idMarca: number;
  nombre: string;
  estado: string;
};

/*//type FilaProducto = {
  idProducto: number;
  nombre: string;
  estado: string;
};*/

export interface Presentacion{
  idPresentacion:number
  nombre:string,
  precio:number,
  inventario:number,
  estado:"Activo"|"Inactivo"
  
} 

export interface marca {
  idMarca: number;
  nombre: string;
  estado: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  estado: string;
  idMarcaNavigation: marca;
}

export interface crearProducto {
  nombre: string;
  idMarca: number;
  estado: string;
}

export interface ActualizarProducto {
  idProducto: number;
  nombre: string;
  idMarca: number;
  estado: string;
}
export function mapRowToProducto(
  row: GridRowModel,
  marca: marca
): crearProducto {
  return {
    nombre: row.nombre,
    idMarca: marca.idMarca,
    estado: row.estado,
  };
}

export function mapRowToProductoAct(
  row: GridRowModel,
  marca: marca
): ActualizarProducto {
  return {
    idProducto: row.idProducto,
    nombre: row.nombre,
    idMarca: marca.idMarca,
    estado: row.estado,
  };
}

const API_BASE = "http://localhost:5187/api";

export const crearProducto = async (nuevo: crearProducto) => {
  try {
    const response = await axios.post(
      `${API_BASE}/Productos/CrearProducto`,
      nuevo
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear Producto", error);
    throw error;
  }
};

export async function actualizarProducto(
  Producto: ActualizarProducto
): Promise<Producto> {
  try {
    const response = await axios.put<Producto>(
      `${API_BASE}/Productos/ActualizarProducto`,
      Producto
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar Producto:", error);
    throw error; // Puedes lanzar un error más específico si querés
  }
}

const eliminarProducto = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_BASE}/Productos/BajaProducto`,
      null,
      { params: { id: id } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar (inhabilitar) el Producto:", error);
    throw error;
  }
};

type Props = {
  marca: marca | null;
};

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
}

export default function TablaRegistroProductos({ marca }: Props) {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    axios
      .get<PaginacionResultado<Producto>>(
        "http://localhost:5187/api/Productos/ObtenerSoloProductos",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
      .then((response) => {
        const filas = response.data.datos.map((p) => ({
          id: p.idProducto, // este es el ID que necesita el DataGrid
          idProducto: p.idProducto,
          nombre: p.nombre,
          estado: p.estado,
          nombreMarca: p.idMarcaNavigation.nombre,
          idMarca: p.idMarcaNavigation.idMarca,
        }));
        setRows(filas);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  React.useEffect(() => {
    if (!marca) return;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.isNew
          ? {
              ...row,
              nombreMarca: marca.nombre,
              idMarca: marca.idMarca,
            }
          : row
      )
    );
  }, [marca]);

  //Toolbar de Agregar
  function EditToolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel } = props;

    // Obtener rol de localStorage
    const rol = localStorage.getItem("rol");

    if (rol !== "Administrador") {
      return null; // Así no se renderiza nada de la Toolbar
    }

    const handleClick = () => {
      if (!marca) {
        toast.warning(
          "Debe seleccionar una marca antes de agregar un producto."
        );
        return;
      }

      const id = randomId();
      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          nombre: "",
          estado: "Activo",
          isNew: true,
          nombreMarca: marca.nombre,
          idMarca: marca.idMarca,
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

  // Este useEffect se dispara cada vez que seleccionás una nueva Producto

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

  const MantenerClickBorrar = (id: GridRowId) => () => {
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
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]{1,30}$/;

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
          `${nombreCampo} solo debe contener letras, numeros y espacios (máximo 30 caracteres).`
        );
      }
    };

    try {
      // 🔒 Validación de nombre del producto
      validarCampoTextoObligatorio(newRow.nombre, "Nombre");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }

    let updatedRow: {
      id: number;
      isNew: boolean;
      nombre: string;
      idMarca: number;
      nombreMarca: string;
    } = {
      id: newRow.id,
      nombre: newRow.nombre,
      idMarca: newRow.nombreMarca,
      nombreMarca: newRow.nombreMarca,
      isNew: false,
    };

    if (newRow.isNew) {
      if (!marca) {
        toast.warning("Tiene que seleccionar una marca");
        return;
      }
      if (marca !== null) {
        const ProductoCreado = await crearProducto(
          mapRowToProducto(newRow, marca)
        );

        updatedRow = {
          ...newRow,
          ...ProductoCreado,
          id: ProductoCreado.idProducto,
          isNew: false,
        };
      }
    } else {
      const ProductoActualizado = await actualizarProducto(
        mapRowToProductoAct(newRow, marca!)
      );
      updatedRow = {
        ...ProductoActualizado,
        id: ProductoActualizado.idProducto,
        nombre: ProductoActualizado.nombre,
        idMarca: ProductoActualizado.idMarcaNavigation.idMarca,
        nombreMarca: ProductoActualizado.idMarcaNavigation.nombre,
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
      field: "idProducto",
      headerName: "ID Producto",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: false,
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
      field: "estado",
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: ["Activo", "Inactivo"],
      flex: 0.7,
      minWidth: 150,
      editable: true,
    },
    {
      field: "idMarca",
      headerName: "Id Marca",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.7,
      minWidth: 150,
      editable: false,
    },
    {
      field: "nombreMarca",
      headerName: "Marca",
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: ["Activo", "Inactivo"],
      flex: 0.7,
      minWidth: 150,
      editable: false,
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
