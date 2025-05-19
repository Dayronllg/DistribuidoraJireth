import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface inputProps {
  label: string;
}

export default function BasicTextFields({ label }: inputProps) {
  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label={label} variant="outlined" />
    </Box>
  );
}
