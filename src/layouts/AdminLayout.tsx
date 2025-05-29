import { Outlet } from "react-router";
import ResponsiveAppBar from "../features/dashboard/components/ResponsiveAppBar";
import { Container } from "@mui/material";

function AdminLayout() {
  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </>
  );
}

export default AdminLayout;
