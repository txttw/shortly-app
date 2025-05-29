import { Box } from "@mui/material";

import ListPageHead from "../../../components/ListPageHead";

import AnalyticsLinkStatistics from "../../../features/analytics/components/AnalyticsLinkStatistics";
import { useParams } from "react-router";

export default function AnalyticsLinkStatsPage() {
  //const user = useAppSelector(selectUser);
  const params = useParams();
  //const navigate = useNavigate();
  //const canCView = user?.permissions.includes(Permissions.Analytics_Read);
  return (
    <Box my={2}>
      <ListPageHead
        title="Analytics"
        subtitle="View analytics"
        hasBack={true}
        sx={{ mb: 2 }}
      />
      <AnalyticsLinkStatistics linkId={params.id!} />
    </Box>
  );
}
