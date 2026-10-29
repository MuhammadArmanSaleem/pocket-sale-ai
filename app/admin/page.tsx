import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { listAdminShops, ownerDisplayName } from "@/lib/supabase/admin-directory";
import * as yup from "yup";
import { listAdminSupportTickets } from "@/lib/supabase/admin-support";
import { signOut } from "@/app/auth-check/actions";
import { AdminSupportControls } from "./support-controls";

export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop } = await searchParams;
  if (shop && !yup.string().uuid().isValidSync(shop)) redirect("/admin");
  const t = await getTranslations(); const access = await getAccountAccess();
  if (!access) redirect("/auth-check");
  if (access.role !== "admin") return <main className="p-6"><p>{t("adminAccessRequired")}</p></main>;
  const [tickets, shops] = await Promise.all([listAdminSupportTickets(shop), listAdminShops()]);
  return <main className="mx-auto grid max-w-3xl gap-6 p-6"><h1>{t("supportTitle")}</h1>
    <p>{t("adminSupportPartial")}</p><form action={signOut}><button type="submit" className="underline">{t("signOutReal")}</button></form>
    <Link href="/account">{t("changeLogin")}</Link>
    <section className="surface grid gap-3 p-6"><h2>{t("owners")}</h2>
      {shops.length === 0 && <p>{t("noResults")}</p>}
      {shops.map(item => <article key={item.id} className="grid gap-1 border-t pt-3"><h3>{item.name}</h3>
        <p>{t("owner")}: {ownerDisplayName(item.profiles)}</p>
        <p>{t("phone")}: <bdi>{item.business_phone || "—"}</bdi></p>
        <p>{t(item.is_active ? "shopActive" : "shopSuspended")}</p>
        <Link className="underline" href={`/admin?shop=${item.id}#support`}>{t("viewShopSupport")}</Link>
      </article>)}
      <p>{t("adminListLimit")}</p>
    </section>
    <h2 id="support">{t("supportTitle")}</h2>
    {shop && <Link href="/admin#support">{t("viewAll")}</Link>}
    {tickets.length === 0 && <p>{t("noResults")}</p>}
    {tickets.map(ticket => <section key={ticket.id} className="surface grid gap-3 p-6"><h2>{ticket.subject}</h2><p><bdi>{ticket.shop_id}</bdi> · {ticket.status}</p>
      {ticket.support_messages.slice().sort((a,b) => a.created_at.localeCompare(b.created_at)).map(message => <p key={message.id}><strong>{message.author_role}: </strong>{message.body}</p>)}
      <AdminSupportControls ticketId={ticket.id} /></section>)}
  </main>;
}
