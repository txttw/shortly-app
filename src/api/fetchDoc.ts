import { UnauthenticatedError } from "../errors/unauthenticatedError";
import { validateAuthOrThrow } from "../features/auth/data/validateAuthUser";
import { DocTypes } from "../types";
import { apiDocPaths } from "./apiData";

export const fetchDoc = async <T>(
  docType: DocTypes,
  id: string,
  propertyName: string
): Promise<T | null> => {
  // This will try to refresh token if possible
  const auth = await validateAuthOrThrow();

  try {
    const url = `${import.meta.env.VITE_API_URL}/${apiDocPaths[docType]}/${id}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      return json[propertyName];
    } else if (res.status === 401) {
      throw new UnauthenticatedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return null;
};
