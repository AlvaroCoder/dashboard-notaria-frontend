import { TextField, Grid } from "@mui/material";

export default function FojasDataForm({ fojasData, handleChangeFojasDatas }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Datos de Fojas</h2>

      <Grid container spacing={2}>
        {/* Bloque Start */}
        <Grid item xs={12} sm={6}>
          <h3 className="text-md font-medium mb-2">Inicio</h3>
          <TextField
            fullWidth
            label="Número"
            variant="outlined"
            value={fojasData.start.number}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.start.number", e.target.value)
            }
          />
          <div className="mt-2">
            <TextField
              fullWidth
              label="Serie"
              variant="outlined"
              value={fojasData.start.serie}
              onChange={(e) =>
                handleChangeFojasDatas("fojasData.start.serie", e.target.value)
              }
            />
          </div>
        </Grid>

        {/* Bloque End */}
        <Grid item xs={12} sm={6}>
          <h3 className="text-md font-medium mb-2">Fin</h3>
          <TextField
            fullWidth
            label="Número"
            variant="outlined"
            value={fojasData.end.number}
            onChange={(e) =>
              handleChangeFojasDatas("fojasData.end.number", e.target.value)
            }
          />
          <div className="mt-2">
            <TextField
              fullWidth
              label="Serie"
              variant="outlined"
              value={fojasData.end.serie}
              onChange={(e) =>
                handleChangeFojasDatas("fojasData.end.serie", e.target.value)
              }
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}