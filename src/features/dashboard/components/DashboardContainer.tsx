import { Outlet } from "react-router";
import DashboardMenu from "./DashboardMenu";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { Container, Drawer, Stack, Toolbar } from "@mui/material";
import { useMemo, useState } from "react";
import { filterMenuByPermissions } from "../../auth/utils/permissionUtils";
import { dashboardMenuItems } from "../menuItems";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../auth/store/authUserSlice";

const drawerWidth = 240;

export default function DashboardContainer() {
  const user = useAppSelector(selectUser);
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const allowedMenuItems = useMemo(
    () => filterMenuByPermissions(dashboardMenuItems, user),
    [user]
  );

  return (
    <>
      <ResponsiveAppBar menuItems={allowedMenuItems} maxWidth={false} />
      <Stack direction="row">
        <Drawer
          open={open}
          onClose={toggleDrawer(false)}
          variant="permanent"
          anchor="left"
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <DashboardMenu menuItems={allowedMenuItems} />
        </Drawer>
        <Container maxWidth="xl">
          <Toolbar />
          <Outlet />
        </Container>
      </Stack>
    </>
  );
}
