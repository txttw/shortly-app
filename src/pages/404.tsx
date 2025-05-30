import { Grid, Stack, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function Page404() {
  return (
    <Grid
      container
      spacing={0}
      rowGap={{ xs: 4, md: 0 }}
      justifyContent={"center"}
      sx={{ color: "#fff" }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 7 }} alignSelf={"center"}>
        <ShareIcon fontSize="large" sx={{ mb: 0.25 }} />
        <Typography variant="h4" fontWeight={800}>
          Shortly
        </Typography>
        <Typography>Dynamic short links and QR codes</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 5 }}>
        <Stack
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            sx={{
              fontSize: "5rem",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "8px",
            }}
          >
            404
          </Typography>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Requested page not found
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
