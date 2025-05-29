import { AuthUser } from "../../../models/AuthUser";

import { refresh } from "../api/refresh";

import {
  authUserFromPayload,
  getExpiresAt,
  payloadFromToken,
} from "../utils/payloadUtils";
import { storeTokens } from "./storeTokens";
import { RefreshTokenStorage, TokenStorage } from "./tokenStorage";

export const loadAuthFromStorage = async (): Promise<AuthUser> => {
  const ts = new TokenStorage();
  const token = ts.get();
  const refreshToken = new RefreshTokenStorage().get();
  if (token) {
    const payload = payloadFromToken(token);
    if (payload?.exp) {
      // Check if the token expired
      const expiresAt = getExpiresAt(payload.exp);
      if (expiresAt > new Date()) {
        // If there is no refresh token something went wrong
        // refuse auth, a new login will store a new refreshtoken
        if (refreshToken) {
          return authUserFromPayload(payload, token, refreshToken);
        }
      } else {
        // expired token we can delete
        ts.delete();
        // check if there is a refresh token and try to refresh
        if (refreshToken) {
          const auth = await refresh(refreshToken);
          if (auth.user) {
            storeTokens(auth);
            return auth;
          }
        }
      }
    }
  } else if (refreshToken) {
    // try to refresh
    const auth = await refresh(refreshToken);
    if (auth.user) {
      storeTokens(auth);
      return auth;
    }
  }
  return { user: null };
};
