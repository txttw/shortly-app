import { Outlet } from "react-router";
import { Container } from "@mui/material";
import "./css/layout.css";

export default function ImageBackgroundLayout() {
  return (
    <div className="login-background-image">
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </div>
  );
}
