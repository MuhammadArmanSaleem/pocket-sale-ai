import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const access = await getAccountAccess();
  if (!access) redirect("/auth-check");
  if (access.role !== "owner" && access.role !== "admin") redirect("/entry");
  const t = await getTranslations();
  return <main className="mx-auto grid max-w-xl gap-5 p-6"><h1>{t("changeLogin")}</h1><PasswordForm /><Link href="/entry">{t("back")}</Link></main>;
}
