import { clearAuthUser } from "../store/authUserSlice";
import { RefreshTokenStorage } from "./tokenStorage";
import { store } from "../../../store";

export const deleteAuthUser = () => {
  new RefreshTokenStorage().delete();
  store.dispatch(clearAuthUser());
};
