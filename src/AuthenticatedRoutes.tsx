import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import TokenRefreshInProgress from "./components/TokenRefreshInProgress";
import { RouteNames } from "./routes";

import { User } from "./models/User";

import { useAppDispatch } from "./hooks/storeHooks";

import {
  refreshAuth,
  validateAuth,
} from "./features/auth/data/validateAuthUser";

function AuthenticatedRoutes() {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();

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
  }, [dispatch, location]);

  const next = user ? (
    <Outlet />
  ) : (
    <Navigate to={RouteNames.Login} replace state={{ from: location }} />
  );

  return !ready ? <TokenRefreshInProgress /> : next;
}

export default AuthenticatedRoutes;
