import { Box, Button } from "@mui/material";
import { Permissions } from "../../../models/Permissions";
import AddIcon from "@mui/icons-material/Add";
import LinkList from "../../../features/links/components/LinkList";
import ListPageHead from "../../../components/ListPageHead";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../../features/auth/store/authUserSlice";

import { RouteNames } from "../../../routes";
import { useNavigate } from "react-router";

export default function LinksPage() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const canCreate = user?.permissions.includes(Permissions.Link_Create);
  return (
    <Box my={2}>
      <ListPageHead
        title="Links"
        subtitle="Create, delete and manage links"
        sx={{ mb: 2 }}
        action={
          canCreate && (
            <Button
              variant="text"
              sx={{ fontWeight: 600 }}
              startIcon={<AddIcon />}
              onClick={() => navigate(RouteNames.LinkCreate)}
            >
              New Link
            </Button>
          )
        }
      />
      <LinkList />
    </Box>
  );
}
