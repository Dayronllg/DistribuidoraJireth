import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface inputProps {
  label: string;
  backgroundColor: string;
}

export default function BasicTextFields({
  label,
  backgroundColor,
}: inputProps) {
  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        sx={{ backgroundColor }}
      />
    </Box>
  );
}

// export default function BasicTextFields({
//   label,
//   backgroundColor,
// }: {
//   label: string;
//   backgroundColor: string;
// }) {
//   return (
//     <Box
//       component="form"
//       sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
//       noValidate
//       autoComplete="off"
//     >
//       <TextField
//         id="outlined-basic"
//         label={label}
//         variant="outlined"
//         sx={{ backgroundColor }}
//       />
//     </Box>
//   );
// }
