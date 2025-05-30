import { Outlet } from "react-router";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import "./css/layout.css";

export default function ImageBackgroundLayout() {
  const theme = useTheme();
  const md_up = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <div className="login-background-image">
      <Container
        maxWidth="lg"
        sx={
          md_up
            ? {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
              }
            : {
                width: "100%",
                pt: 2,
              }
        }
      >
        <Outlet />
      </Container>
    </div>
  );
}
