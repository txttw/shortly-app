import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import TokenRefreshInProgress from "./components/TokenRefreshInProgress";
import { RouteNames } from "./routes";
import { User } from "./models/User";
import {
  refreshAuth,
  validateAuth,
} from "./features/auth/data/validateAuthUser";

function NotAuthenticatedRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      let auth = await validateAuth(false);
      if (!auth) {
        setReady(false);
        auth = await refreshAuth();
      }
      setUser(auth?.user || null);
      setReady(true);
    };

    checkAuth();
  }, [location.state, user]);

  const next = !user ? (
    <Outlet />
  ) : (
    <Navigate to={RouteNames.Dashboard} replace state={{ from: location }} />
  );

  return !ready ? <TokenRefreshInProgress /> : next;
}

export default NotAuthenticatedRoutes;
