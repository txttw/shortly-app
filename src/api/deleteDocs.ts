import { UnauthenticatedError } from "../errors/unauthenticatedError";
import { ActionStatus, DocTypes } from "../types";
import { apiDocPaths } from "./apiData";
import { validateAuthOrThrow } from "../features/auth/data/validateAuthUser";

export const deleteDocs = async (
  docType: DocTypes,
  ids: string[]
): Promise<ActionStatus> => {
  // This will try to refresh token if possible
  const auth = await validateAuthOrThrow();
  try {
    const url = `${import.meta.env.VITE_API_URL}/${
      apiDocPaths[docType]
    }/bulk/delete`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      return ActionStatus.Ok;
    } else if (res.status === 401) {
      throw new UnauthenticatedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return ActionStatus.NotOk;
};
