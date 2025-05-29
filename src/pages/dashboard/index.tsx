import { Box, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import DashboardStats from "../../features/dashboard/components/DashboardStats";
import DashboardCard from "../../features/dashboard/components/DashboardCard";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectUser } from "../../features/auth/store/authUserSlice";
import { Permissions } from "../../models/Permissions";
import { filterMenuByPermissions } from "../../features/auth/utils/permissionUtils";
import { dashboardMenuItems } from "../../features/dashboard/menuItems";
import { useMemo } from "react";

export default function Dashboard() {
  const user = useAppSelector(selectUser);

  const allowedMenuItems = useMemo(
    () =>
      // We dont need the dashboard menu item here
      filterMenuByPermissions(dashboardMenuItems, user).filter(
        (item) => item.id !== "dashboard"
      ),
    [user]
  );

  return (
    <Box mt={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Welcome, {user?.username}
      </Typography>

      {user?.permissions.includes(Permissions.Analytics_Read) && (
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
            fontSize={"1.2rem"}
            mb={1.2}
          >
            Statistics for {dayjs().format("MMMM, YYYY")}
          </Typography>
          <DashboardStats sx={{ mb: 3 }} />
        </Box>
      )}
      <Typography
        variant="h5"
        fontWeight={600}
        fontSize={"1.2rem"}
        mb={1.2}
        mt={4}
      >
        Start creating and managing links
      </Typography>
      <Grid container rowSpacing={4} columnSpacing={2.6}>
        {allowedMenuItems.map(({ id, title, subtitle, to, icon }) => (
          <Grid key={id} size={{ xs: 12, md: 6, lg: 4 }}>
            <DashboardCard
              title={title}
              subtitle={subtitle}
              icon={icon}
              route={to}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
