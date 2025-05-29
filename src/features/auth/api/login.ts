import processValidationErrors from "../../../api/processValidationErrors";
import { AuthUser } from "../../../models/AuthUser";
import { APIResult } from "../../../types";
import { payloadFromToken, authUserFromPayload } from "../utils/payloadUtils";

export enum LoginStatus {
  Ok,
  InvalidCredentials,
  ValidationError,
  UnexpectedError,
}

export interface LoginResult extends APIResult<AuthUser> {
  status: LoginStatus;
}

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<LoginResult> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/auth/login`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username: username, password }),
    });
    if (res.ok) {
      const json = await res.json();
      const payload = payloadFromToken(json.token);

      return {
        status: LoginStatus.Ok,
        data: authUserFromPayload(payload, json.token, json.refresh),
      };
    }
    if (res.status == 400) {
      try {
        const json = await res.json();
        if (json?.error?.issues) {
          return {
            status: LoginStatus.ValidationError,
            error: processValidationErrors(json.error.issues),
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // empty
      }
    }
    if (res.status == 401) {
      return { status: LoginStatus.InvalidCredentials };
    }
  } catch (err: unknown) {
    // Do nothing here
  }
  return { status: LoginStatus.UnexpectedError };
};
