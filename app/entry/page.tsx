import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { accessDestination } from "@/lib/access";
import { signOut } from "@/app/auth-check/actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export default async function EntryPage() {
  const access = await getAccountAccess();
  const destination = accessDestination(access);
  if (destination) redirect(destination);
  const t = await getTranslations();
  return <main className="mx-auto grid max-w-xl gap-4 p-6">
    <h1>{t("accountUnavailableTitle")}</h1>
    <p>{t(access?.role === "suspended" ? "accountSuspended" : "accountNotProvisioned")}</p>
    <form action={signOut}><Button type="submit">{t("signOutReal")}</Button></form>
  </main>;
}
