import { TextField, Grid } from "@mui/material";

export default function FojasDataForm({ fojasData, handleChangeFojasDatas }) {
  return (
<div className="border rounded-lg bg-white w-full p-6">
  <Grid container spacing={3} className="w-full">
    {/* Bloque Start */}
    <Grid item xs={12} sm={6} >
      <h3 className="text-md font-medium mb-4 ">Inicio</h3>
      <Grid container spacing={2}  >
        <Grid item xs={12} sm={6} gridColumn={2}>
          <TextField
            fullWidth
            label="Número"
            variant="outlined"
            value={fojasData.start.number}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.start.number", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} >
          <TextField
            fullWidth
            label="Serie"
            variant="outlined"
            value={fojasData.start.serie}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.start.serie", e.target.value)
            }
          />
        </Grid>
    </Grid>
    </Grid>

    {/* Bloque End */}
    <Grid item xs={12} sm={6}>
      <h3 className="text-md font-medium mb-4 ">Fin</h3>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Número"
            variant="outlined"
            value={fojasData.end.number}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.end.number", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Serie"
            variant="outlined"
            value={fojasData.end.serie}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.end.serie", e.target.value)
            }
          />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</div>
  );
}