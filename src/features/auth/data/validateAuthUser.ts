import { UnauthenticatedError } from "../../../errors/unauthenticatedError";

import { store } from "../../../store";

import { refresh } from "../api/refresh";
import { setAuthUser } from "../store/authUserSlice";

import { RefreshTokenStorage } from "./tokenStorage";

export const validateAuth = async (tryRefresh: boolean = true) => {
  const state = store.getState();
  if (
    !state.authUser.user ||
    !state.authUser.expiresAt ||
    new Date(state.authUser.expiresAt) < new Date()
  ) {
    if (tryRefresh) {
      return await refreshAuth();
    }
  } else {
    // auth ok
    return state.authUser;
  }
  return undefined;
};

export const validateAuthOrThrow = async (tryRefresh: boolean = true) => {
  const auth = await validateAuth(tryRefresh);
  if (!auth) {
    throw new UnauthenticatedError();
  }
  return auth;
};

export const refreshAuth = async () => {
  const refreshToken = new RefreshTokenStorage().get();
  if (refreshToken) {
    // try to refresh
    const auth = await refresh(refreshToken);
    if (auth.user) {
      store.dispatch(setAuthUser(auth));
      return auth;
    }
  }
  return undefined;
};
