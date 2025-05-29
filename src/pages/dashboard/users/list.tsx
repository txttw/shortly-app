import { Stack, Button, Box } from "@mui/material";
import UserList from "../../../features/users/components/UserList";
import AddIcon from "@mui/icons-material/Add";
import ListPageHead from "../../../components/ListPageHead";
import { hasSomePermissions } from "../../../utils";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../../features/auth/store/authUserSlice";
import { Permissions } from "../../../models/Permissions";
import { useNavigate } from "react-router";
import { RouteNames } from "../../../routes";

export default function UsersPage() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const canViewList = hasSomePermissions(user?.permissions, [
    Permissions.User_ReadAll,
    Permissions.User_WriteAll,
  ]);
  const canCreate = user?.permissions.includes(Permissions.User_Create);

  return (
    <Box my={2}>
      <ListPageHead
        title="Users"
        subtitle="Create, delete and manage users"
        sx={{ mb: 2 }}
        action={
          canCreate && (
            <Button
              variant="text"
              sx={{ fontWeight: 600 }}
              startIcon={<AddIcon />}
              onClick={() => navigate(RouteNames.UserCreate)}
            >
              New User
            </Button>
          )
        }
      />
      {canViewList ? (
        <UserList />
      ) : (
        <Stack
          mt={1}
          p={5}
          border={(theme) => `1px dotted ${theme.palette.grey[600]} `}
          justifyContent={"center"}
          alignItems={"center"}
        >
          Do not have permission to view users
        </Stack>
      )}
    </Box>
  );
}
