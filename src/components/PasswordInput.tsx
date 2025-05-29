import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FilledTextFieldProps,
  IconButton,
  InputAdornment,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";

export default function PasswordInput(
  props: JSX.IntrinsicAttributes & {
    variant?: TextFieldVariants | undefined;
  } & Omit<
      FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
      "variant"
    >
) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
