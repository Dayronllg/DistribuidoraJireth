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

import {
  randomId
} from "@mui/x-data-grid-generator";
import axios from "axios";
import type { PaginacionResultado } from "../../Trabajadores/components/TablaTrabajadores";


export type FilaMarcas = {
  idMarca: number;
  nombre: string;
  estado: string;
};

export type Props = {
  marca: FilaMarcas|null;
};



type FilaProducto = {
  idProducto: number;
  nombre: string;
  estado: string;
};


interface Presentacion{
  idPresentacion:number
  nombre:string,
  precio:number,
  inventario:number,
  estado:"Activo"|"Inactivo"
  
} 

interface marca {
    idMarca: number,
    nombre: string,
    estado: string
}

export interface Producto{

  idProducto: number,
  nombre: string,
  estado: string,
  marca:marca,
  presentaciones:Presentacion[]

}

export function mapRowToProducto(row: GridRowModel): Producto {
  return {
    idProducto: row.idProducto,
    nombre: row.nombre,
    estado:row.estado,
      marca:{
      idMarca:row.idMarca,
      nombre:row.nombre,
      estado:row.estado
    },
    presentaciones: (row.presentaciones || []).map((p: any) => ({
      idPresentacion: p.idPresentacion,
      nombre: p.nombre,
      precio: p.precio,
      inventario: p.inventario,
      Estado:"activo",
      idProductos: p.idProductos
    }))
  };
}

const API_BASE='http://localhost:5187/api'

export const crearProducto = async (nuevo: Producto) => {
  try {
    const response = await axios.post(`${API_BASE}/Productos/CrearProducto`, nuevo);
    return response.data;
  } catch (error) {
    console.error("Error al crear Producto", error);
    throw error;
  }
};


export async function actualizarProducto(Producto: Producto): Promise<Producto> {
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
    const response = await axios.put(`${API_BASE}/Productos/BajaProducto`,null,{params:{id:id}} 
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar (inhabilitar) el Producto:', error);
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


export default function TablaRegistroProductos(marca:Props) {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

 React.useEffect(() => {
    axios
      .get<PaginacionResultado<Producto>>(
        "http://localhost:5187/api/Marcas/ObtenerMarcas",
        {
          params: {
            pagina: 1,
            tamanioPagina: 100,
          },
        }
      )
     .then((response) => {
      const filas = response.data.datos.flatMap((producto) =>
        producto.presentaciones.map((p) => ({
          id: p.idPresentacion, // este es el ID que necesita el DataGrid
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          estado: producto.estado,
          idMarca: producto.marca.idMarca,
          nombreMarca: producto.marca.nombre,
          // Datos de la presentación
          idPresentacion: p.idPresentacion,
          nombreP: p.nombre,
          precio: p.precio,
          inventario: p.inventario,
          
        }))
      );

      setRows(filas);
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
    });
}, []);

//Toolbar de Agregar
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
    let updatedRow: { id: number; isNew: boolean } = { id: newRow.id, isNew: false };
    
      if (newRow.isNew) {
        const ProductoCreado = await crearProducto(mapRowToProducto(newRow));
    
        updatedRow = {
          ...newRow,
          ...ProductoCreado,
          id: ProductoCreado.idProducto, 
          isNew: false,
        };
      } else {
        const ProductoActualizado = await actualizarProducto(mapRowToProducto(newRow));
        updatedRow = {
          ...ProductoActualizado,
          id: ProductoActualizado.idProducto, 
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
      field: "idPresentacion",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: true,
    },
    {
      field: "nombreP",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      type: "string",
      flex: 0.5,
      minWidth: 150,
      editable: true,
    },
    {
      field: "precio",
      headerName: "precio",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: true
      
    },
    {
      field: "idProducto",
      headerName: "ID Producto",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      minWidth: 150,
      editable: true
      
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
