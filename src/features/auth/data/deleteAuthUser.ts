import { clearAuthUser } from "../store/authUserSlice";
import { RefreshTokenStorage, TokenStorage } from "./tokenStorage";
import { store } from "../../../store";

export const deleteAuthUser = () => {
  new TokenStorage().delete();
  new RefreshTokenStorage().delete();
  store.dispatch(clearAuthUser());
};
