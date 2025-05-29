import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";

import { Link } from "../../../models/Link";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { RouteNames } from "../../../routes";
import { ActionStatus, DocTypes, ValidationError } from "../../../types";
import { createDoc } from "../../../api/createDoc";
import LinkEditForm from "../../../features/links/components/LinkEditForm";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../../features/auth/store/authUserSlice";
import dayjs from "dayjs";

const propertyName = "link";

export default function LinkCreatePage() {
  const user = useAppSelector(selectUser);
  const [link, setLink] = useState<Partial<Link> | null>({
    short: "",
    long: "",
    userId: user?.id,
    user: {
      username: user!.username,
    },
    expiresAt: dayjs().add(7, "day").endOf("day").toDate(),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<ActionStatus | null>(null);
  const navigate = useNavigate();

  const onCreate = useCallback(async () => {
    if (!link) return;
    setLoading(true);
    try {
      setStatus(null);
      const res = await createDoc(
        DocTypes.Links,
        {
          ...link,
          user: undefined,
          userId: undefined,
          short: link.short || undefined,
        },
        propertyName
      );
      if (res.error) {
        setErrors(res.error);
        setStatus(ActionStatus.NotOk);
      } else if (res.data) {
        setLink(res.data);
        setStatus(ActionStatus.Ok);
        //await navigate(RouteNames.Links);
      }
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }
    setLoading(false);
  }, [navigate, link]);

  return (
    <Box my={2}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        {`Create ${link?.short || ""}`}
      </Typography>
      {link && (
        <Box>
          <LinkEditForm
            loading={loading}
            errors={errors}
            status={status}
            link={link}
            isCreate={true}
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
              onClick={() => onCreate()}
            >
              Create
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
