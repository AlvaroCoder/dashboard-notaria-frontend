'use client';

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function InputPasswordMaterialUi({
    value, 
    onChange
}) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div>
        <TextField
        label="Contraseña"
        variant="outlined"
        name="password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        className="bg-white rounded-md font-poppins"
      />
    </div>
  )
};