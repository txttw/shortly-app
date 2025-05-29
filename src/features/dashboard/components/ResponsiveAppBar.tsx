import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Breakpoint, CircularProgress, Stack } from "@mui/material";
import { useNavigate, Link } from "react-router";
import ShareIcon from "@mui/icons-material/Share";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../auth/store/authUserSlice";
import { deleteAuthUser } from "../../auth/data/deleteAuthUser";
import { RouteNames } from "../../../routes";
import { logout } from "../../auth/api/logout";
import { routePath } from "../../../routeUtils";
import { MenuItemDescriptor } from "../../../types";

interface Props {
  maxWidth?: false | Breakpoint;
  menuItems: MenuItemDescriptor[];
}

function ResponsiveAppBar({ menuItems, maxWidth = "xl" }: Props) {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [loggingOut, setLoggingOut] = React.useState(false);

  const user = useAppSelector(selectUser);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavigation = (to: string) => {
    navigate(to);
    setAnchorElNav(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const res = await logout();
    if (res) {
      deleteAuthUser();
      await navigate(RouteNames.Login);
    }
    setLoggingOut(false);
  };

  const toProfile = async () => {
    if (user) {
      setAnchorElUser(null);
      await navigate(routePath(RouteNames.UserEdit, { id: user.id }));
    }
  };

  return (
    <AppBar
      position="fixed"
      color="info"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth={maxWidth}>
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <Stack
              direction={"row"}
              sx={{ mr: 3, color: "#fff" }}
              alignItems={"center"}
            >
              <ShareIcon fontSize="large" sx={{ mr: 1.6, color: "#fff" }} />

              <Typography
                variant="h5"
                noWrap
                component="span"
                sx={{
                  display: { xs: "block", md: "flex" },
                  fontWeight: 800,
                  color: "inherit",
                }}
              >
                Shortly
              </Typography>
            </Stack>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {menuItems.map(({ id, title, to, icon }) => (
                <MenuItem key={id} onClick={() => handleNavigation(to)}>
                  <Stack direction={"row"} spacing={2} py={0.5}>
                    {icon}
                    <Typography>{title}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* We dont use top menu only dropdown on small screen*/}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.username}>
                  {user?.username.slice(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={toProfile}>
                <Typography sx={{ textAlign: "center" }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={logOut}>
                {loggingOut && <CircularProgress size={16} sx={{ mr: 1 }} />}
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
