import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncSlice } from "../../../createAsyncSlice";
import { AuthUser } from "../../../models/AuthUser";

const initialState: AuthUser = {
  user: null,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const authUserSlice = createAsyncSlice({
  name: "authUser",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setAuthUser: create.reducer((_state, action: PayloadAction<AuthUser>) => {
      return action.payload;
    }),
    clearAuthUser: create.reducer(() => {
      return { ...initialState };
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectUser: (authUser) =>
      authUser?.expiresAt && new Date(authUser.expiresAt) > new Date()
        ? authUser.user
        : null,
    selectToken: (authUser) => authUser.token,
    selectRefresh: (authUser) => authUser.refresh,
    selectExpiry: (authUser) => authUser.expiresAt,
  },
});

// Action creators are generated for each case reducer function.
export const { setAuthUser, clearAuthUser } = authUserSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUser, selectToken, selectRefresh, selectExpiry } =
  authUserSlice.selectors;
