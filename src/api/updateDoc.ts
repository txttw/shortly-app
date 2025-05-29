import { UnauthenticatedError } from "../errors/unauthenticatedError";
import { APIResult, DocTypes } from "../types";
import processValidationErrors from "./processValidationErrors";
import { BaseResource } from "../models/BaseResource";
import { apiDocPaths } from "./apiData";
import { validateAuthOrThrow } from "../features/auth/data/validateAuthUser";

export const updateDoc = async <T extends BaseResource>(
  docType: DocTypes,
  doc: Partial<T>,
  propertyName: string
): Promise<APIResult<T>> => {
  // This will try to refresh token if possible
  const auth = await validateAuthOrThrow();

  try {
    const url = `${import.meta.env.VITE_API_URL}/${apiDocPaths[docType]}/${
      doc.id
    }`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      method: "PATCH",
      body: JSON.stringify(doc),
    });
    if (res.ok) {
      const json = await res.json();
      return { data: json[propertyName] };
    } else if (res.status == 400) {
      try {
        const json = await res.json();
        if (json?.error?.issues) {
          return { error: processValidationErrors(json.error.issues) };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        // empty
      }
    } else if (res.status === 401) {
      throw new UnauthenticatedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return {};
};
