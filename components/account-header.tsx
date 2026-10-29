import { getTranslations } from "next-intl/server";
import { signOut } from "@/app/auth-check/actions";
import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/types";

export async function AccountHeader({ role }: { role: Role }) {
  const t = await getTranslations();
  return <header className="app-header">
    <div><p className="font-semibold">PocketSales AI</p><p className="muted">{t(role)}</p></div>
    <div className="flex flex-wrap items-center gap-3"><LanguageSelector /><form action={signOut}><Button type="submit" variant="outline">{t("signOutReal")}</Button></form></div>
  </header>;
}
