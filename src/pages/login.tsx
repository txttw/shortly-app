import { Grid, Typography } from "@mui/material";
import LoginCard from "../features/auth/components/LoginCard";
import ShareIcon from "@mui/icons-material/Share";

function LoginPage() {
  return (
    <Grid
      container
      spacing={0}
      rowGap={{ xs: 4, md: 0 }}
      justifyContent={"center"}
    >
      <Grid size={{ xs: 12, sm: 8, md: 7 }} alignSelf={"center"} color="#fff">
        <ShareIcon fontSize="large" sx={{ mb: 0.25, color: "#fff" }} />
        <Typography variant="h4" fontWeight={800}>
          Shortly
        </Typography>
        <Typography>Sign in or create an account</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 5 }}>
        <LoginCard />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
