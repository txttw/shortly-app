import { validateAuthOrThrow } from "../data/validateAuthUser";

export const logout = async (): Promise<boolean> => {
  // This will try to refresh token if possible
  const auth = await validateAuthOrThrow();
  try {
    const url = `${import.meta.env.VITE_API_URL}/auth/logout`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      method: "POST",
    });
    if (res.ok) {
      return true;
    } else if (res.status === 401) {
      // Its ok
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Do nothing here
  }
  return false;
};
