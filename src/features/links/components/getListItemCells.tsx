import { Button, TableCell } from "@mui/material";
import { Link } from "../../../models/Link";
import AppLink from "../../../components/AppLink";
import { RouteNames } from "../../../routes";
import LaunchIcon from "@mui/icons-material/Launch";

export default function getListItemCells({
  id,
  short,
  long,
  user,
  userId,
  expiresAt,
  createdAt,
}: Link) {
  return [
    <TableCell
      component="th"
      scope="row"
      sx={{ color: (theme) => theme.palette.text.primary }}
    >
      <AppLink to={RouteNames.LinkEdit} params={{ id }} className="app-link">
        {id}
      </AppLink>
    </TableCell>,
    <TableCell align="left">
      {
        <Button
          variant="text"
          href={`${import.meta.env.VITE_GO_URL}/${short}`}
          target="_blank"
          endIcon={<LaunchIcon />}
          color="secondary"
        >
          {short}
        </Button>
      }
    </TableCell>,
    <TableCell align="left">{long}</TableCell>,
    <TableCell align="left">{user?.username || userId}</TableCell>,
    <TableCell align="left">
      <div>{new Date(expiresAt!).toLocaleDateString()}</div>
    </TableCell>,
    <TableCell align="left">
      <div>{new Date(createdAt!).toLocaleDateString()}</div>
      <div>{new Date(createdAt!).toLocaleTimeString()}</div>
    </TableCell>,
  ];
}
