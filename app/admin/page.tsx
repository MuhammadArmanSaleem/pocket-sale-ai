import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { listAdminSupportTickets } from "@/lib/supabase/admin-support";
import { signOut } from "@/app/auth-check/actions";
import { AdminSupportControls } from "./support-controls";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const t = await getTranslations(); const access = await getAccountAccess();
  if (!access) redirect("/auth-check");
  if (access.role !== "admin") return <main className="p-6"><p>{t("adminAccessRequired")}</p></main>;
  const tickets = await listAdminSupportTickets();
  return <main className="mx-auto grid max-w-3xl gap-6 p-6"><h1>{t("supportTitle")}</h1>
    <p>{t("adminSupportPartial")}</p><form action={signOut}><button type="submit" className="underline">{t("signOutReal")}</button></form>
    {tickets.length === 0 && <p>{t("noResults")}</p>}
    {tickets.map(ticket => <section key={ticket.id} className="surface grid gap-3 p-6"><h2>{ticket.subject}</h2><p><bdi>{ticket.shop_id}</bdi> · {ticket.status}</p>
      {ticket.support_messages.slice().sort((a,b) => a.created_at.localeCompare(b.created_at)).map(message => <p key={message.id}><strong>{message.author_role}: </strong>{message.body}</p>)}
      <AdminSupportControls ticketId={ticket.id} /></section>)}
  </main>;
}
