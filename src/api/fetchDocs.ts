import { UnauthenticatedError } from "../errors/unauthenticatedError";
import { DocTypes, PaginatedResults } from "../types";
import * as qs from "qs-esm";

import { apiDocPaths } from "./apiData";
import { validateAuthOrThrow } from "../features/auth/data/validateAuthUser";

export const fetchDocs = async <T, Q>(
  docType: DocTypes,
  queryRequest?: Q
): Promise<PaginatedResults<T>> => {
  // This will try to refresh token if possible
  const auth = await validateAuthOrThrow();
  try {
    const query = queryRequest ? "?" + qs.stringify(queryRequest) : "";
    const url = `${import.meta.env.VITE_API_URL}/${
      apiDocPaths[docType]
    }${query}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.token}`,
      },
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    } else if (res.status === 401) {
      throw new UnauthenticatedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return {
    docs: [],
  };
};
