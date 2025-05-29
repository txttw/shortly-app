import { TableCell } from "@mui/material";
import { User } from "../../../models/User";
import { permissionLabels } from "../../../models/Permissions";
import CollapsibleContent from "../../../components/CollapsibleContent";
import AppLink from "../../../components/AppLink";
import { RouteNames } from "../../../routes";

export default function getListItemCells({
  id,
  username,
  permissions,
  createdAt,
}: User) {
  return [
    <TableCell
      component="th"
      scope="row"
      sx={{ color: (theme) => theme.palette.text.primary }}
    >
      <AppLink to={RouteNames.UserEdit} params={{ id }} className="app-link">
        {id}
      </AppLink>
    </TableCell>,
    <TableCell align="left">{username}</TableCell>,
    <TableCell align="left">
      <CollapsibleContent>
        {permissions.map((s) => (
          <div key={s} className="p-list-item">
            {permissionLabels[s]}
          </div>
        ))}
      </CollapsibleContent>
    </TableCell>,
    <TableCell align="left">
      <div>{new Date(createdAt!).toLocaleDateString()}</div>
      <div>{new Date(createdAt!).toLocaleTimeString()}</div>
    </TableCell>,
  ];
}
