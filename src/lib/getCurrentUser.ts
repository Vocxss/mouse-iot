import { cookies as cookieStore } from "next/headers";
import { authAdmin } from "./firebaseAdmin";

export const getCurrentUser = async () => {
  const cookie = await cookieStore();
  const sessionCookie = cookie.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await authAdmin.verifySessionCookie(sessionCookie);
    return decoded;
  } catch (error) {
    return null;
  }
};
