import { Box, Button, Stack, Typography } from "@mui/material";
import { UserEditForm } from "../../../features/users/components/UserEditForm";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchDoc } from "../../../api/fetchDoc";
import { User } from "../../../models/User";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { RouteNames } from "../../../routes";
import { ActionStatus, DocTypes, ValidationError } from "../../../types";
import { updateDoc } from "../../../api/updateDoc";
import CenteredProgress from "../../../components/CenteredProgress";

const propertyName = "user";

export default function UserEditPage() {
  const params = useParams();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<ActionStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        let doc: User | null = null;
        if (params.id) {
          doc = await fetchDoc<User>(DocTypes.Users, params.id, propertyName);
        }
        if (doc) {
          setUser(doc);
        } else {
          await navigate(RouteNames.Page404);
        }
      } catch (err: unknown) {
        if (err instanceof UnauthenticatedError) {
          await navigate(RouteNames.Login);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate, params.id]);

  const onSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setStatus(null);
      const res = await updateDoc(DocTypes.Users, user, propertyName);
      if (res.error) {
        setErrors(res.error);
        setStatus(ActionStatus.NotOk);
      } else if (res.data) {
        setUser(res.data);
        setStatus(ActionStatus.Ok);
      }
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }
    setLoading(false);
  };

  return (
    <Box my={2}>
      {!user && loading && <CenteredProgress />}
      <Typography variant="h6" fontWeight={600} mb={3}>
        {`Edit ${user?.username || ""}`}
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
              onClick={() => onSave()}
            >
              Save
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
