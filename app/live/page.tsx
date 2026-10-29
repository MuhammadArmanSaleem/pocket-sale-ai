import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { listProducts } from "@/lib/supabase/catalogue";
import { AddVariantForm } from "./add-variant-form";
import { VariantEditor } from "./variant-editor";
import { ProductDetailsEditor } from "./product-details-editor";
import { VisibilityButton } from "./visibility-button";
import { ProductForm } from "./product-form";
import { PolicyForm } from "./policy-form";
import { loadShopPolicy } from "@/lib/supabase/policies";
import { listSupportTickets } from "@/lib/supabase/support";
import { SupportForm } from "./support-form";
import { signOut } from "@/app/auth-check/actions";

export const dynamic = "force-dynamic";

export default async function LiveCatalogue() {
  const t = await getTranslations();
  const access = await getAccountAccess();
  if (!access) redirect("/auth-check");
  if (access.role !== "owner") {
    return <main className="mx-auto grid max-w-3xl gap-4 p-6"><p>{t("catalogueUnavailable")}</p><form action={signOut}><button type="submit">{t("signOutReal")}</button></form></main>;
  }
  const [products, policy, tickets] = await Promise.all([listProducts(), loadShopPolicy(), listSupportTickets()]);
  return (
    <main className="mx-auto grid max-w-3xl gap-6 p-6">
      <header><h1>{t("catalogueTitle")}</h1><p>{t("realCataloguePartial")}</p></header>
      <form action={signOut}><button className="underline" type="submit">{t("signOutReal")}</button></form>
      <ProductForm />
      {policy ? <PolicyForm initial={policy} /> : <p>{t("policyMissing")}</p>}
      <section><h2>{t("products")}</h2>
        {products.length === 0 ? <p>{t("noResults")}</p> : <ul>{products.map((p) => <li key={p.id} className="grid gap-2 border-b py-3"><strong>{p.name}</strong><p>{p.category} · {t(p.is_visible ? "active" : "hidden")}</p>
          <ul>{p.product_variants.map(variant => <li key={variant.id}>{variant.size} · {variant.colour} · <bdi>Rs {Number(variant.unit_price).toLocaleString("en-PK")}</bdi> · {t("stock")}: {variant.stock_quantity}<VariantEditor variantCount={p.product_variants.length} variantId={variant.id} productId={p.id} version={variant.updated_at} size={variant.size} colour={variant.colour} price={Number(variant.unit_price)} stock={variant.stock_quantity} /></li>)}</ul>
          <AddVariantForm productId={p.id} variantCount={p.product_variants.length} />
          <VisibilityButton productId={p.id} visible={p.is_visible} />
          <ProductDetailsEditor productId={p.id} version={p.updated_at} name={p.name} category={p.category} description={p.description} />
        </li>)}</ul>}
      </section>
      <section className="surface grid gap-4 p-6"><h2>{t("supportTitle")}</h2><SupportForm />
        {tickets.map(ticket => <article key={ticket.id} className="grid gap-3 border-t pt-4"><h3>{ticket.subject}</h3><p>{ticket.status}</p>
          {ticket.support_messages.slice().sort((a, b) => a.created_at.localeCompare(b.created_at)).map(message => <p key={message.id}><strong>{message.author_role}: </strong>{message.body}</p>)}
          <SupportForm ticketId={ticket.id} />
        </article>)}
      </section>
      <Link href="/account">{t("changeLogin")}</Link>
      <Link href="/">{t("backToPreview")}</Link>
    </main>
  );
}
