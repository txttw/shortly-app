import { Permissions } from "../../../models/Permissions";

export interface TokenPayload {
  sub: string;
  name: string;
  perm: Permissions[];
  exp: number;
}

export const getExpiresAt = (plExpiresAt: number) => {
  return new Date((plExpiresAt - 20) * 1000); // -20 sec
};

export const payloadFromToken = (token: string) => {
  const parts = token.split(".");
  return JSON.parse(atob(parts[1]));
};

export const authUserFromPayload = (
  payload: TokenPayload,
  token?: string,
  refresh?: string
) => {
  return {
    user: {
      id: payload.sub,
      username: payload.name,
      permissions: payload.perm,
    },
    expiresAt: getExpiresAt(payload.exp).toISOString(),
    token,
    refresh,
  };
};
