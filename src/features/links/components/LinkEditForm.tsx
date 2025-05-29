import { Link } from "../../../models/Link";
import { Alert, Box, Stack, TextField } from "@mui/material";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../auth/store/authUserSlice";
import { ActionStatus, MUIProps, ValidationError } from "../../../types";
import { Permissions } from "../../../models/Permissions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { PickerValue } from "@mui/x-date-pickers/internals";
import DownloadableQRCode from "../../../components/DownloadableQRCode";

export default function LinkEditForm({
  loading,
  errors,
  status,
  link,
  onChange,
  sx,
  disabled = false,
  isCreate = false,
}: {
  loading: boolean;
  errors: ValidationError;
  status: ActionStatus | null;
  link: Partial<Link>;
  disabled?: boolean;
  isCreate?: boolean;
  onChange?: (u: Partial<Link>) => void;
} & MUIProps) {
  const authUser = useAppSelector(selectUser);
  const [localError, setLocalError] = useState<string>("");

  const handleExpiresAtChange = (v: PickerValue) => {
    if (!v) {
      setLocalError("Date can not be embty");
      return;
    }
    onChange?.({ ...link, expiresAt: v.endOf("day").toDate() });
  };

  const hasExpiresAtError = !!errors.expiresAt || !!localError;
  const shortHelperText = !isCreate
    ? "Can not modify short link"
    : !errors.short
    ? "Empty or 6 characters long"
    : errors.short;

  return (
    <Box sx={sx}>
      <Stack direction={"column"} spacing={4}>
        {status === ActionStatus.Ok && (
          <Alert severity="success">{`Link ${
            isCreate ? "created" : "updated"
          } successfully`}</Alert>
        )}
        <Stack direction={"row"} spacing={2}>
          <TextField
            fullWidth
            id="short"
            label="Short"
            error={!!errors.short}
            value={link.short}
            disabled={loading || disabled || !isCreate}
            helperText={shortHelperText}
            onChange={(e) => onChange?.({ ...link, short: e.target.value })}
          />
          {authUser?.permissions.includes(Permissions.Link_WriteAll) && (
            <TextField
              required
              fullWidth
              id="user"
              label="User"
              value={link?.user?.username || link?.user?.id || link.userId}
              disabled={true}
              helperText="Can not modify the owner"
            />
          )}
        </Stack>
        <TextField
          required
          fullWidth
          id="long"
          label="Long"
          error={!!errors.long}
          value={link.long}
          disabled={loading || disabled}
          helperText={errors.long}
          onChange={(e) => onChange?.({ ...link, long: e.target.value })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Expiry date"
            value={dayjs(link.expiresAt)}
            onChange={handleExpiresAtChange}
            slotProps={{
              textField: {
                disabled,
                error: hasExpiresAtError,
                helperText: errors.expiresAt || localError,
              },
            }}
          />
        </LocalizationProvider>
      </Stack>

      {link?.id && (
        <DownloadableQRCode
          sx={{ mt: 1 }}
          qrContainerStyles={{ my: 1 }}
          value={`${import.meta.env.VITE_GO_URL}/${link.short}`}
          filename={`shortly-${link.short}.png`}
        />
      )}
    </Box>
  );
}
