import { Box, Stack, Typography } from "@mui/material";

import ListPageHead from "../../../components/ListPageHead";
import LiveAnalytics from "../../../features/analytics/components/LiveAnalytics";
import { useState } from "react";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";

export default function AnalyticsLivePage() {
  //const user = useAppSelector(selectUser);
  //const navigate = useNavigate();
  const [isSocketReady, setIsSocketReady] = useState(false);
  //const canCView = user?.permissions.includes(Permissions.Analytics_Read);
  return (
    <Box my={2}>
      <ListPageHead
        title="Analytics Live"
        subtitle="View live analytics"
        sx={{ mb: 2 }}
        action={
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            justifyContent={"end"}
          >
            {isSocketReady ? (
              <SensorsIcon color="success" />
            ) : (
              <SensorsOffIcon color="error" />
            )}
            <Typography fontSize={"0.9rem"}>
              {isSocketReady ? "Online" : "Offline"}
            </Typography>
          </Stack>
        }
      />

      <LiveAnalytics onSocketStateChange={setIsSocketReady} />
    </Box>
  );
}
