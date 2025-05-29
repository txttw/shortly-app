import { Box, Button, Stack, Typography } from "@mui/material";
import { UserEditForm } from "../../../features/users/components/UserEditForm";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";

import { User } from "../../../models/User";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { RouteNames } from "../../../routes";
import { ActionStatus, DocTypes, ValidationError } from "../../../types";
import { createDoc } from "../../../api/createDoc";
import CenteredProgress from "../../../components/CenteredProgress";

const propertyName = "user";
const pwMismatchText = "Pasword and repeat password has to be equal";

export default function UserCreatePage() {
  const [user, setUser] = useState<Partial<User>>({
    username: "",
    password: "",
    passwordRepeat: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<ActionStatus | null>(null);
  const navigate = useNavigate();

  const onCreate = useCallback(async () => {
    if (user.password !== user.passwordRepeat) {
      setErrors({ password: pwMismatchText, passwordRepeat: pwMismatchText });
      return;
    }
    setLoading(true);
    try {
      setStatus(null);
      const res = await createDoc(DocTypes.Users, user, propertyName);
      if (res.error) {
        setErrors(res.error);
        setStatus(ActionStatus.NotOk);
      } else if (res.data) {
        setUser(res.data);
        setStatus(ActionStatus.Ok);
        await navigate(RouteNames.Users);
      }
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }
    setLoading(false);
  }, [navigate, user]);

  return (
    <Box my={2}>
      {!user && loading && <CenteredProgress />}
      <Typography variant="h6" fontWeight={600} mb={3}>
        {`Create ${user?.username || ""}`}
      </Typography>
      {user && (
        <Box>
          <UserEditForm
            loading={loading}
            errors={errors}
            status={status}
            user={user}
            onChange={setUser}
          />

          <Stack mt={3} spacing={1} direction={"row"} justifyContent={"start"}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              loading={loading}
              sx={{ px: 3 }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              size="small"
              loading={loading}
              sx={{ px: 3 }}
              onClick={() => onCreate()}
            >
              Save
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
