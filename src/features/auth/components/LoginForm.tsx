import {
  Alert,
  Box,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Button } from "@mui/material";
import { login, LoginStatus } from "../api/login";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ValidationError } from "../../../types";

import { storeTokens } from "../data/storeTokens";
import { RouteNames } from "../../../routes";
import PasswordInput from "../../../components/PasswordInput";

function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<LoginStatus | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleLogin = async () => {
    setErrors({});
    setLoading(true);
    try {
      const res = await login(credentials);
      setStatus(res.status);
      if (res.status === LoginStatus.Ok && !!res.data) {
        storeTokens(res.data);
        const from = location.state?.from;
        const path = from
          ? from.pathname + from.search + from.hash
          : RouteNames.Dashboard;
        await navigate(path);
      } else if (res.status === LoginStatus.ValidationError && !!res.error) {
        setErrors(res.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setStatus(LoginStatus.UnexpectedError);
    }
    setLoading(false);
  };
  return (
    <Box my={4}>
      <Grid container spacing={0} justifyContent={"center"}>
        <Grid size={12}>
          <Stack direction={"column"} spacing={4}>
            {status === LoginStatus.InvalidCredentials && (
              <Alert severity="error">Invalid username or password</Alert>
            )}
            {status === LoginStatus.UnexpectedError && (
              <Alert severity="error">
                An error happened. Unable to sign in.
              </Alert>
            )}
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              value={credentials.username}
              error={!!errors.username}
              helperText={errors.username}
              onChange={(e) =>
                setCredentials((v) => ({ ...v, username: e.target.value }))
              }
              slotProps={{
                input: {
                  startAdornment: !!errors.username && (
                    <InputAdornment position="start">
                      <WarningAmberIcon color="error" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <PasswordInput
              required
              fullWidth
              id="password"
              label="Password"
              value={credentials.password}
              error={!!errors.password}
              helperText={errors.password}
              onChange={(e) =>
                setCredentials((v) => ({ ...v, password: e.target.value }))
              }
            />
            <Stack direction={"row"} justifyContent={"end"}>
              <Button
                variant="contained"
                size="small"
                loading={loading}
                sx={{ px: 3 }}
                onClick={handleLogin}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginForm;
