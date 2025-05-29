import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import LoginCard from "../features/auth/components/LoginCard";
import ShareIcon from "@mui/icons-material/Share";
import { useElementPosition } from "../hooks/useElementPosition";

function LoginPage() {
  const { boundingBox, windowDimensions } = useElementPosition(".login-card");
  const theme = useTheme();
  const md_up = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Grid
      container
      spacing={0}
      rowGap={{ xs: 4, md: 0 }}
      style={{
        padding: `${
          md_up ? (windowDimensions.height - (boundingBox?.height || 0)) / 2 : 0
        }px 0`,
      }}
    >
      <Grid size={{ xs: 12, md: 7 }} alignSelf={"center"} color="#fff">
        <ShareIcon fontSize="large" sx={{ mb: 0.25, color: "#fff" }} />
        <Typography variant="h4" fontWeight={800}>
          Shortly
        </Typography>
        <Typography>Sign in or create an account</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <LoginCard />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
