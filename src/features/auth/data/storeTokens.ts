import { AuthUser } from "../../../models/AuthUser";
import { store } from "../../../store";
import { setAuthUser } from "../store/authUserSlice";
import { RefreshTokenStorage } from "./tokenStorage";

export const storeTokens = (authUser: AuthUser) => {
  new RefreshTokenStorage().set(authUser.refresh!);
  store.dispatch(setAuthUser(authUser));
};
