import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router";
import { MenuItemDescriptor, MUIProps } from "../../../types";

interface Props {
  menuItems: MenuItemDescriptor[];
}

function DashboardMenu({ menuItems, sx }: Props & MUIProps) {
  const navigate = useNavigate();
  const handleClick = (to: string) => () => {
    navigate(to, { relative: "route" });
  };

  return (
    <Box sx={sx} role="presentation">
      <List>
        {menuItems.map(({ id, title, to, icon }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton onClick={handleClick(to)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default DashboardMenu;
