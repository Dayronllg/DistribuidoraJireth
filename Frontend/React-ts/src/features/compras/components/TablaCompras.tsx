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
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";

type Props = {
  nuevasFilas: any[]; // Puedes reemplazar 'any' por un tipo más específico si lo deseas
};

export default function TablaCompras({ nuevasFilas }: Props) {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  // Agrega nuevas filas cuando lleguen desde props
  React.useEffect(() => {
    if (nuevasFilas.length > 0) {
      const nuevasConId = nuevasFilas.map((fila) => ({
        id: randomId(),
        ...fila,
      }));
      setRows((prev) => [...prev, ...nuevasConId]);
    }
  }, [nuevasFilas]);

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

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
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
      />
    </Box>
  );
}
