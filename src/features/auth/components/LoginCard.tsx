import { Box, Stack, Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import { blueGrey } from "@mui/material/colors";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { Link } from "@mui/material";
import { useCallback, useState } from "react";
import DemoInfoModal from "./DemoInfoModal";

const radius = "0.4rem";

function LoginCard() {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const openInfo = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setInfoModalOpen(true);
    event.preventDefault();
  }, []);

  return (
    <>
      <Box
        className="login-card"
        borderRadius={radius}
        sx={{ backgroundColor: "#fff" }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          px={2}
          py={1}
          color={"#fff"}
          sx={{
            backgroundColor: blueGrey[900],
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          }}
        >
          <InfoOutlineIcon sx={{ mr: 2 }} fontSize="small" />
          <Typography fontSize={"0.85rem"}>
            Please, verify your identity to access private information
          </Typography>
        </Stack>
        <Box p={6} pt={4}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Sign in
          </Typography>
          <Stack direction={"row"} alignItems={"center"} mb={8}>
            <Typography mr={1} fontWeight={500} fontSize={"1rem"}>
              New user?
            </Typography>
            <Link
              href="#"
              underline="none"
              fontWeight={500}
              fontSize={"1rem"}
              onClick={openInfo}
            >
              Create an account
            </Link>
          </Stack>
          <Box mb={6}>
            <LoginForm />
          </Box>
          <Link
            href="#"
            underline="none"
            fontWeight={500}
            fontSize={"1rem"}
            onClick={openInfo}
          >
            Need help signing in?
          </Link>
        </Box>
      </Box>
      <DemoInfoModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />
    </>
  );
}

export default LoginCard;
