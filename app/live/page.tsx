import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { listProducts } from "@/lib/supabase/catalogue";
import { ProductForm } from "./product-form";
import { signOut } from "@/app/auth-check/actions";

export const dynamic = "force-dynamic";

export default async function LiveCatalogue() {
  const t = await getTranslations();
  const access = await getAccountAccess();
  if (!access) redirect("/auth-check");
  if (access.role !== "owner") {
    return <main className="mx-auto grid max-w-3xl gap-4 p-6"><p>{t("catalogueUnavailable")}</p><form action={signOut}><button type="submit">{t("signOutReal")}</button></form></main>;
  }
  const products = await listProducts();
  return (
    <main className="mx-auto grid max-w-3xl gap-6 p-6">
      <header><h1>{t("catalogueTitle")}</h1><p>{t("realCataloguePartial")}</p></header>
      <form action={signOut}><button className="underline" type="submit">{t("signOutReal")}</button></form>
      <ProductForm />
      <section><h2>{t("products")}</h2>
        {products.length === 0 ? <p>{t("noResults")}</p> : <ul>{products.map((p) => <li key={p.id} className="border-b py-3"><strong>{p.name}</strong> · {p.category} · {t(p.is_visible ? "active" : "hidden")}</li>)}</ul>}
      </section>
      <Link href="/">{t("backToPreview")}</Link>
    </main>
  );
}
