import { AuthUser } from "../../../models/AuthUser";
import { RefreshTokenStorage, TokenStorage } from "./tokenStorage";

export const storeTokens = (authUser: AuthUser) => {
  new TokenStorage().set(authUser.token!);
  new RefreshTokenStorage().set(authUser.refresh!);
};
