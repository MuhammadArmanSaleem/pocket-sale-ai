import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "./login-form";
import { LanguageSelector } from "@/components/language-selector";

export const dynamic = "force-dynamic";

export default async function AuthCheck({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: signInError } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const signedIn = !error && Boolean(data?.claims?.sub);
  if (signedIn) redirect("/entry");
  const t = await getTranslations();
  return (
    <main className="mx-auto grid max-w-xl gap-5 px-6 py-10">
      <h1>{t("loginTitle")}</h1>
      <LanguageSelector />
      <p>{t("loginRealPartial")}</p>
      <LoginForm failed={Boolean(signInError)} />
    </main>
  );
}
