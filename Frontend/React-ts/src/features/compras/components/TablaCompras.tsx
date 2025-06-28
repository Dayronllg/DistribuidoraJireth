import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import type {
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModesModel,
  GridSlotProps,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";

import type { FilaCompra } from "../pages/Compras";
type PropsTablaCompras = {
  rows: FilaCompra[];
  setRows: React.Dispatch<React.SetStateAction<FilaCompra[]>>;
  nuevaFila: FilaCompra | null;
  onClick: () => void;
 
};

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
      {
        id,
        cantidad: 0,
        idProducto: 0,
        idPresentacion: 0,
        nombreProducto: "",
        nombrePresentacion: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "cantidad" },
    }));
  };
}

export default function TablaCompras({
  nuevaFila,
  rows,
  setRows,
}: PropsTablaCompras) {
const handleClick = () => {
  const id = randomId();
  setRows((oldRows) => [
    ...oldRows,
    {
      id,
      cantidad: 0,
      idProducto: 0,
      idPresentacion: 0,
      nombreProducto: "",
      nombrePresentacion: "",
      isNew: true,
    },
  ]);
  setRowModesModel((oldModel) => ({
    ...oldModel,
    [id]: { mode: GridRowModes.Edit, fieldToFocus: "cantidad" },
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
          Finalizar Registro de Compra
        </Button>
      </Tooltip>
    </Toolbar>
  );
}

export default function TablaCompras({ nuevaFila,rows,setRows }: PropsTablaCompras) {
  //const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  // Agrega nueva fila cuando lleguen desde props
  React.useEffect(() => {
    if (nuevaFila) {
      const filaConId = {
        // Este random ID se genera random para la tabla ya que si no ponia eso al darle click al boton Agregar daba conflicto con el DOM porque la tabla esperaba un ID
        // ya cuando vos lo conectes a la API con el ID autonumerico me imagino que no dara conflicto y no se necesitará ese randomID
        id: randomId(),
        cantidad: nuevaFila.cantidad,
        idProducto: nuevaFila.idProducto,
        idPresentacion: nuevaFila.idPresentacion,
        nombreProducto: "", // Texto Vacio
        nombrePresentacion: "", // Texto Vacio
        isNew: true,
      };
      setRows((prev) => [...prev, filaConId]);
    }
  }, [nuevaFila]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: FilaCompra) => {
    const updatedRow = { ...(newRow as FilaCompra), isNew: false };
    setRows((prev) =>
      prev.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };
  const handleRowModesModelChange = (newModel: GridRowModesModel) => {
    setRowModesModel(newModel);
  };

  const rol = localStorage.getItem("rol");

  const baseColumns: GridColDef[] = [
    {
      field: "cantidad",
      headerName: "Cantidad",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.5,
      editable: true,
    },
    {
      field: "idProducto",
      headerName: "ID Producto",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.8,
      editable: true,
    },
    {
      field: "nombreProducto",
      headerName: "Nombre Producto",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
    },
    {
      field: "idPresentacion",
      headerName: "ID Presentación",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.8,
      editable: true,
    },
    {
      field: "nombrePresentacion",
      headerName: "Nombre Presentación",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
    },
  ];

  const columns: GridColDef[] =
    rol === "Administrador"
      ? [
          ...baseColumns,
          {
            field: "actions",
            headerName: "Acciones",
            type: "actions",
            flex: 0.8,
            getActions: ({ id }) => {
              const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isEditing) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Guardar"
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancelar"
                    onClick={handleCancelClick(id)}
                  />,
                ];
              }

              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Editar"
                  onClick={handleEditClick(id)}
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Eliminar"
                  onClick={handleDeleteClick(id)}
                />,
              ];
            },
          },
        ]
      : baseColumns;

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        mt: 3,
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#007bff",
          color: "#fff",
          fontWeight: "bold",
        },
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
        slotProps={{
          toolbar: {
            setRows: setRows as unknown as (
              newRows: (
                oldRows: readonly GridValidRowModel[]
              ) => readonly GridValidRowModel[]
            ) => void,
            setRowModesModel,
          },
        }}
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
