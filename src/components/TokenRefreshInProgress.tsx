import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

function TokenRefreshInProgress() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "90%",
      }}
    >
      <Stack
        direction={"column"}
        alignItems={"center"}
        spacing={1}
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <SecurityOutlinedIcon sx={{ fontSize: "2.5rem" }} />
        <Stack direction={"row"} alignItems={"center"} spacing={1.75}>
          <CircularProgress size={28} thickness={5} sx={{ flexShrink: 0 }} />

          <Typography fontSize={"1.2rem"} fontWeight={600}>
            Just a moment, authorizing action ...
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TokenRefreshInProgress;
