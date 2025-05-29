import { Paper, Stack, Typography } from "@mui/material";
import { JSX } from "react";
import { RouteNames } from "../../../routes";
import { useNavigate } from "react-router";

export default function DashboardCard({
  title,
  subtitle,
  icon,
  route,
}: {
  title: string;
  subtitle?: string;
  icon?: JSX.Element;
  route: RouteNames;
}) {
  const navigate = useNavigate();

  return (
    <Paper onClick={() => navigate(route)} sx={{ p: 4, cursor: "pointer" }}>
      <Stack direction={"row"} alignItems={"center"} spacing={1.6} mb={1}>
        {icon}
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
      </Stack>
      <Typography>{subtitle}</Typography>
    </Paper>
  );
}
