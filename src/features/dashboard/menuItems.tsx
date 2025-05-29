import { RouteNames } from "../../routes";
import { MenuItemDescriptor } from "../../types";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LinkIcon from "@mui/icons-material/Link";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

export const dashboardMenuItems: MenuItemDescriptor[] = [
  {
    id: "dashboard",
    to: RouteNames.Dashboard,
    title: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: "links",
    to: RouteNames.Links,
    title: "Links",
    subtitle: "Manage links",
    icon: <LinkIcon />,
  },
  {
    id: "analytics",
    to: RouteNames.Analytics,
    title: "Analytics",
    subtitle: "View analytics",
    icon: <AssessmentOutlinedIcon />,
  },
  {
    id: "live-analytics",
    to: RouteNames.AnalyticsLive,
    title: "Live Analytics",
    subtitle: "View analytics live",
    icon: <AnalyticsOutlinedIcon />,
  },
  {
    id: "users",
    to: RouteNames.Users,
    title: "Users",
    subtitle: "Manage users",
    icon: <PersonOutlineOutlinedIcon />,
  },
];
