import { Link } from "react-router";
import { routePath } from "../routeUtils";

interface AppLinkProps {
  to: string;
  params?: { [key: string]: string };
  [x: string]: unknown;
}

export default function AppLink({ to, params = {}, ...args }: AppLinkProps) {
  return <Link to={routePath(to, params)} {...args} />;
}
