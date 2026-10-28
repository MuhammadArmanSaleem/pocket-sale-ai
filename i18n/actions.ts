"use server";
import { cookies } from "next/headers";
import { COOKIE_MAX_AGE, isLocale, LOCALE_COOKIE } from "@/lib/constants";
export async function setLocale(value: string) {
  if (!isLocale(value)) throw new Error("Unsupported locale");
  (await cookies()).set(LOCALE_COOKIE, value, {
    path: "/",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
