import { createTheme } from "@mui/material/styles";

export const DefaultThem = createTheme({
  typography: {
    fontFamily: `"Open Sans", 'sans-serif'`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    secondary: {
      main: "#37474F",
      light: "#455A64",
      dark: "#263238",
      contrastText: "#fff",
    },
    info: {
      main: "#1565C0",
    },
  },
});
