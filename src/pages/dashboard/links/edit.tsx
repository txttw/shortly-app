import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchDoc } from "../../../api/fetchDoc";
import { Link } from "../../../models/Link";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { RouteNames } from "../../../routes";
import { ActionStatus, DocTypes, ValidationError } from "../../../types";
import { updateDoc } from "../../../api/updateDoc";
import CenteredProgress from "../../../components/CenteredProgress";
import LinkEditForm from "../../../features/links/components/LinkEditForm";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../../features/auth/store/authUserSlice";
import { Permissions } from "../../../models/Permissions";

const propertyName = "link";

export default function LinkEditPage() {
  const user = useAppSelector(selectUser);
  const params = useParams();
  const [link, setLink] = useState<Partial<Link> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<ActionStatus | null>(null);
  const navigate = useNavigate();

  const canEdit =
    user?.permissions.includes(Permissions.Link_WriteAll) ||
    (link && link.userId === user?.id);

  useEffect(() => {
    const fetchLink = async () => {
      setLoading(true);
      try {
        let doc: Link | null = null;
        if (params.id) {
          doc = await fetchDoc<Link>(DocTypes.Links, params.id, propertyName);
        }
        if (doc) {
          setLink(doc);
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
    fetchLink();
  }, [navigate, params.id]);

  const onSave = async () => {
    if (!link) return;
    setLoading(true);
    try {
      setStatus(null);
      const res = await updateDoc(
        DocTypes.Links,
        { ...link, user: undefined, userId: undefined, short: undefined },
        propertyName
      );
      if (res.error) {
        setErrors(res.error);
        setStatus(ActionStatus.NotOk);
      } else if (res.data) {
        setLink(res.data);
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
      {!link && loading && <CenteredProgress />}
      <Typography variant="h6" fontWeight={600} mb={3}>
        {`Edit ${link?.short || ""}`}
      </Typography>
      {link && (
        <Box>
          <LinkEditForm
            loading={loading}
            errors={errors}
            status={status}
            link={link}
            disabled={!canEdit}
            onChange={setLink}
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
              disabled={!canEdit}
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
