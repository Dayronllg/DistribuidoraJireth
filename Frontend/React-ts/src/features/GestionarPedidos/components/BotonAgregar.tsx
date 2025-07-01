import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";


type Props={
  AgregarPedido:()=>void
}

export default function BotonAgregar({AgregarPedido}:Props) {
  return (
    <Button
    onClick={AgregarPedido}
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        marginTop: "15px",
        color: "white",
        fontWeight: "bold",
        fontSize: "15px",
        width: "100%",
        backgroundColor: "#007bff",
        "&:hover": { backgroundColor: "#0056b3" },
      }}
    >
      Agregar
    </Button>
  );
}
