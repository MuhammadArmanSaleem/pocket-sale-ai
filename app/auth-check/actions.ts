"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation";

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") redirect("/auth-check?error=1");
  const valid = await loginSchema.isValid({ email, password }, { strict: true });
  if (!valid) redirect("/auth-check?error=1");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) redirect("/auth-check?error=1");
  revalidatePath("/auth-check");
  redirect("/auth-check");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/auth-check");
}
