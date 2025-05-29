import { AuthUser } from "../../../models/AuthUser";
import { authUserFromPayload, payloadFromToken } from "../utils/payloadUtils";

export const refresh = async (refreshToken: string): Promise<AuthUser> => {
  try {
    if (!refreshToken) return { user: null };
    const url = `${import.meta.env.VITE_API_URL}/auth/refresh`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (res.ok) {
      const json = await res.json();
      const payload = payloadFromToken(json.token);

      return authUserFromPayload(payload, json.token, refreshToken);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return { user: null };
};
