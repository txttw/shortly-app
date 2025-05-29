import { User } from "../../../models/User";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../auth/store/authUserSlice";
import { ActionStatus, MUIProps, ValidationError } from "../../../types";
import { permissionLabels, Permissions } from "../../../models/Permissions";
import PasswordInput from "../../../components/PasswordInput";
import { useMemo } from "react";
import { hasSomePermissions } from "../../../utils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 260,
    },
  },
};

export function UserEditForm({
  loading,
  errors,
  status,
  user,
  onChange,
  sx,
  isCreate,
  disabled = false,
}: {
  loading: boolean;
  errors: ValidationError;
  status: ActionStatus | null;
  user: Partial<User>;
  disabled?: boolean;
  isCreate?: boolean;
  onChange?: (u: Partial<User>) => void;
} & MUIProps) {
  const authUser = useAppSelector(selectUser);

  const handleChange = (event: SelectChangeEvent<Permissions[]>) => {
    onChange?.({ ...user, permissions: event.target.value as Permissions[] });
  };

  const canGrant = useMemo(
    () =>
      hasSomePermissions(authUser?.permissions, [
        Permissions.Grant_All,
        Permissions.Grant_Owned,
      ]),
    [authUser]
  );

  const grantablePermissions = authUser?.permissions.includes(
    Permissions.Grant_All
  )
    ? Object.values(Permissions)
    : authUser!.permissions;

  return (
    <Box sx={sx}>
      <Grid container spacing={0} justifyContent={"center"}>
        <Grid size={12}>
          <Stack direction={"column"} spacing={4}>
            {status === ActionStatus.Ok && (
              <Alert severity="success">{`User ${
                isCreate ? "created" : "updated"
              } successfully`}</Alert>
            )}

            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              value={user.username}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading || disabled}
              onChange={(e) =>
                onChange?.({ ...user, username: e.target.value })
              }
            />
            <PasswordInput
              required
              fullWidth
              id="password"
              label="Password"
              value={user.password}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading || disabled}
              onChange={(e) =>
                onChange?.({ ...user, password: e.target.value })
              }
            />
            <PasswordInput
              required
              fullWidth
              id="passwordRepeat"
              label="Repeat Password"
              value={user.passwordRepeat}
              error={!!errors.passwordRepeat}
              helperText={errors.passwordRepeat}
              disabled={loading || disabled}
              onChange={(e) =>
                onChange?.({ ...user, passwordRepeat: e.target.value })
              }
            />
            <FormControl
              fullWidth
              error={!!errors.scopes}
              disabled={loading || disabled}
            >
              <InputLabel id="scopes-edit">Scopes</InputLabel>
              <Select
                labelId="scopes-edit"
                id="scopes-edit-select"
                multiple
                disabled={!canGrant}
                value={user.permissions}
                onChange={handleChange}
                input={<OutlinedInput id="scopes-edit-select" label="Scopes" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={permissionLabels[value]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {grantablePermissions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    <Checkbox
                      checked={user.permissions?.includes(permission)}
                    />
                    <ListItemText primary={permissionLabels[permission]} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors.permissions}>
                {errors.permissions}
              </FormHelperText>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
