import { Box } from "@mui/material";

import ListPageHead from "../../../components/ListPageHead";

import AnalyticsList from "../../../features/analytics/components/AnalyticsList";

export default function AnalyticsPage() {
  //const user = useAppSelector(selectUser);
  //const navigate = useNavigate();
  //const canCView = user?.permissions.includes(Permissions.Analytics_Read);
  return (
    <Box my={2}>
      <ListPageHead
        title="Analytics"
        subtitle="View analytics"
        sx={{ mb: 2 }}
      />
      <AnalyticsList />
    </Box>
  );
}
