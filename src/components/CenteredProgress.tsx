import { CircularProgress, Stack } from "@mui/material";

export default function CenteredProgress({ size = 30 }) {
  return (
    <Stack direction={"row"} justifyContent={"center"}>
      <CircularProgress size={size} />
    </Stack>
  );
}
