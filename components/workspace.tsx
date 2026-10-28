"use client";
import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Package,
  MessagesSquare,
  ClipboardList,
  LifeBuoy,
  Menu,
  ArrowRight,
  Store,
  Link2,
  ShieldCheck,
  LogOut,
  Plus,
  Search,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Heading, Choice, Money } from "./shared";
import { Catalogue } from "@/features/catalogue/catalogue";
import { Support } from "@/features/support/support";
import { Sessions } from "./sessions";
import {
  navigationIcons,
  ownerNavigation,
  adminNavigation,
  previewProducts,
  previewSessions,
  previewShops,
  previewTickets,
  previewOrders,
  languageOptions,
  metricKeys,
  adminMetricKeys,
  activityBars,
  roleOptions,
} from "@/lib/data";
import { isLocale } from "@/lib/constants";
import type {
  Page,
  Role,
  Stage,
  NavigationProps,
  AttentionProps,
} from "@/lib/types";
import { setLocale } from "@/i18n/actions";

export function Workspace() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState<Role>("owner");
  const [stage, setStage] = useState<Stage>("login");
  const [page, setPage] = useState<Page>("overview");
  const [mobile, setMobile] = useState(false);
  const [shopName, setShopName] = useState("Studio Clothing");
  const [connected, setConnected] = useState(false);
  const [failed, setFailed] = useState(false);
  const [products, setProducts] = useState(previewProducts);
  const [sessions, setSessions] = useState(previewSessions);
  const [shops, setShops] = useState(previewShops);
  const [tickets, setTickets] = useState(previewTickets);
  const [notice, setNotice] = useState("");
  const [ownerDialog, setOwnerDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigation = role === "admin" ? adminNavigation : ownerNavigation;
  function go(p: Page) {
    setPage(p);
    setMobile(false);
    setNotice("");
  }
  function switchRole(v: string) {
    if (v !== "admin" && v !== "owner") return;
    setRole(v);
    setPage("overview");
    setStage("login");
    setNotice("");
  }
  const nav = <Nav items={navigation} current={page} go={go} />;
  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <Choice
        label={t("language")}
        value={locale}
        options={languageOptions}
        onChange={(v) => {
          if (isLocale(v))
            startTransition(async () => {
              await setLocale(v);
              router.refresh();
            });
        }}
      />
      <Choice
        label={t("profile")}
        value={role}
        onChange={switchRole}
        options={roleOptions.map((value) => ({ value, label: t(value) }))}
      />
      {pending && (
        <span className="sr-only" role="status">
          …
        </span>
      )}
    </div>
  );
  return (
    <div className="min-h-dvh">
      {stage !== "workspace" ? (
        <>
          <header className="app-header">
            <Brand />
            {controls}
          </header>
          <main className="mx-auto grid max-w-6xl gap-12 px-6 py-10 md:grid-cols-2 md:items-center md:py-20">
            <div>
              <Badge variant="secondary" className="mb-6">
                {t("demo")}
              </Badge>
              <h1 className="text-4xl leading-tight md:text-5xl">
                {t("tagline")}
              </h1>
              <p className="mt-5 max-w-md text-base">
                {t(
                  stage === "login"
                    ? "loginSub"
                    : stage === "setup"
                      ? "setupSub"
                      : "connectSub",
                )}
              </p>
              <div className="mt-10 flex gap-3">
                <span className="icon-tile">
                  <Store />
                </span>
                <span className="icon-tile">
                  <MessagesSquare />
                </span>
                <span className="icon-tile">
                  <Package />
                </span>
              </div>
            </div>
            <section className="surface p-6 md:p-9">
              <div className="icon-tile mb-5">
                {stage === "connection" ? <Link2 /> : <Store />}
              </div>
              <h2 className="text-2xl">
                {t(
                  stage === "login"
                    ? "loginTitle"
                    : stage === "setup"
                      ? "setupTitle"
                      : "connectTitle",
                )}
              </h2>
              <p className="my-4 text-sm">
                {t(
                  stage === "login"
                    ? "loginHint"
                    : stage === "connection"
                      ? "connectHint"
                      : "demoNotice",
                )}
              </p>
              {stage === "login" ? (
                <form
                  className="grid gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStage(role === "admin" ? "workspace" : "setup");
                  }}
                >
                  <Field
                    label={t("email")}
                    type="email"
                    required
                    autoComplete="off"
                    defaultValue="owner@example.com"
                  />
                  <Field
                    label={t("password")}
                    type="password"
                    required
                    autoComplete="off"
                    defaultValue="preview-only"
                  />
                  <Button className="min-h-12">
                    {t("login")}
                    <ArrowRight className="rtl:rotate-180" />
                  </Button>
                </form>
              ) : stage === "setup" ? (
                <form
                  className="grid gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (shopName.trim()) setStage("connection");
                  }}
                >
                  <Field
                    label={t("shopName")}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    maxLength={100}
                  />
                  <Field
                    label={t("ownerName")}
                    defaultValue="Ahmed Raza"
                    required
                  />
                  <Field
                    label={t("phone")}
                    type="tel"
                    dir="ltr"
                    placeholder="+92"
                    required
                  />
                  <Button>
                    {t("continue")}
                    <ArrowRight className="rtl:rotate-180" />
                  </Button>
                </form>
              ) : (
                <div className="grid gap-4">
                  {failed && (
                    <p
                      className="rounded-lg border border-destructive p-3 text-sm text-destructive"
                      role="alert"
                    >
                      {t("connectionError")}
                    </p>
                  )}
                  <Button
                    className="min-h-12"
                    onClick={() => {
                      setConnected(true);
                      setFailed(false);
                      setStage("workspace");
                    }}
                  >
                    <Link2 />
                    {t(failed ? "retry" : "connectDemo")}
                  </Button>
                  <Button variant="outline" onClick={() => setFailed(true)}>
                    {t("simulateFailure")}
                  </Button>
                  <Button variant="ghost" onClick={() => setStage("setup")}>
                    {t("back")}
                  </Button>
                </div>
              )}
              <p className="mt-6 border-t pt-4 text-xs">{t("demoNotice")}</p>
            </section>
          </main>
        </>
      ) : (
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="sticky top-0 hidden h-dvh flex-col border-e bg-sidebar px-5 py-8 lg:flex">
            <Brand />
            <div className="my-8 rounded-xl border bg-card p-3">
              <div className="flex items-center gap-3">
                <Store className="size-5 text-primary" />
                <div>
                  <b className="text-sm">
                    {role === "admin" ? t("admin") : shopName}
                  </b>
                  <p className="text-xs">
                    {t(role === "admin" ? "adminWorkspace" : "workspace")}
                  </p>
                </div>
              </div>
            </div>
            {nav}
            <div className="mt-auto rounded-xl bg-secondary/60 p-4">
              <Leaf className="mb-3 size-5 text-primary" />
              <h2 className="text-sm">{t("tagline")}</h2>
              <p className="mt-2 text-xs">{t("reloadHint")}</p>
            </div>
            <Button
              variant="ghost"
              className="mt-4 justify-start"
              onClick={() => setStage("login")}
            >
              <LogOut />
              {t("signOut")}
            </Button>
          </aside>
          <div className="min-w-0">
            <header className="app-header">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label={t("menu")}
                  onClick={() => setMobile(true)}
                >
                  <Menu />
                </Button>
                <div className="text-xs text-muted-foreground">
                  {t(role === "admin" ? "adminWorkspace" : "workspace")}
                  <ChevronRight className="mx-2 inline size-3 rtl:rotate-180" />
                  <span className="font-medium text-foreground">{t(page)}</span>
                </div>
              </div>
              {controls}
            </header>
            <main className="content-area">
              <div className="preview-banner flex flex-wrap items-center justify-between gap-2">
                <span>{t("demoNotice")}</span>
                <Badge variant="outline">{t("demo")}</Badge>
              </div>
              {notice && (
                <div
                  role="status"
                  className="mb-5 flex items-center justify-between gap-3 rounded-lg border bg-card p-4"
                >
                  <span>{notice}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotice("")}
                    aria-label={t("close")}
                  >
                    ×
                  </Button>
                </div>
              )}
              {page === "overview" ? (
                <>
                  <Heading
                    title={t(role === "admin" ? "adminTitle" : "overviewTitle")}
                    subtitle={t(role === "admin" ? "adminSub" : "overviewSub")}
                    action={
                      <Button
                        onClick={() =>
                          role === "admin"
                            ? setOwnerDialog(true)
                            : go("catalogue")
                        }
                      >
                        <Plus />
                        {t(role === "admin" ? "createOwner" : "addProduct")}
                      </Button>
                    }
                  />
                  <div className="metric-grid">
                    {(role === "admin" ? adminMetricKeys : metricKeys).map(
                      (key, i) => {
                        const values =
                          role === "admin"
                            ? [
                                shops.length,
                                shops.filter((s) => s.connected).length,
                                tickets.filter((t) => t.status !== "resolved")
                                  .length,
                                tickets.filter((t) => t.status === "resolved")
                                  .length,
                              ]
                            : [
                                sessions.length,
                                sessions.filter((s) => s.mode === "ai").length,
                                previewOrders.length,
                                products.filter((p) => p.visible).length,
                              ];
                        return (
                          <div className="surface p-5" key={key}>
                            <div className="text-xs text-muted-foreground">
                              {t(key)}
                            </div>
                            <div className="stat-value">{values[i]}</div>
                            <p className="mt-2 text-xs">{t("sampleMetric")}</p>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="workspace-grid">
                    <section className="surface overflow-hidden">
                      <div className="flex items-center justify-between border-b p-5">
                        <h2>
                          {t(role === "admin" ? "openQueries" : "activity")}
                        </h2>
                        <Badge variant="secondary">{t("sample")}</Badge>
                      </div>
                      {role === "admin" ? (
                        tickets
                          .filter((t) => t.status !== "resolved")
                          .map((ti) => (
                            <div key={ti.id} className="info-row">
                              <div className="icon-tile">
                                <LifeBuoy />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h2 className="text-sm">{ti.subject}</h2>
                                <p className="text-xs">
                                  {shops.find((s) => s.id === ti.shopId)?.name}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                onClick={() => go("support")}
                              >
                                {t("open")}
                              </Button>
                            </div>
                          ))
                      ) : (
                        <div className="p-6">
                          <div
                            className="flex h-48 items-end gap-3 border-b"
                            aria-label={t("week")}
                          >
                            {activityBars.map((b) => (
                              <div
                                key={b.day}
                                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-3"
                              >
                                <div
                                  className={`w-full rounded-t-md ${b.day === "sun" ? "bg-primary" : "bg-primary/20"}`}
                                  style={{ height: `${b.count * 4}px` }}
                                />
                                <span className="pb-2 text-xs text-muted-foreground">
                                  {t(b.day)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-5 text-xs">{t("week")}</p>
                        </div>
                      )}
                    </section>
                    <section className="surface">
                      <div className="border-b p-5">
                        <h2>{t("attention")}</h2>
                      </div>
                      <Attention
                        icon={<MessagesSquare />}
                        title={t("urgent")}
                        sub={t("urgentSub")}
                        onClick={() =>
                          go(role === "admin" ? "support" : "sessions")
                        }
                      />
                      <Attention
                        icon={<ClipboardList />}
                        title={t("reviewOrders")}
                        sub={t("reviewOrdersSub")}
                        onClick={() =>
                          go(role === "admin" ? "owners" : "orders")
                        }
                      />
                      <Attention
                        icon={<Package />}
                        title={t("lowStock")}
                        sub={t("lowStockSub")}
                        onClick={() =>
                          go(role === "admin" ? "owners" : "catalogue")
                        }
                      />
                    </section>
                  </div>
                  <section className="surface mt-6">
                    <div className="flex justify-between border-b p-5">
                      <h2>{t(role === "admin" ? "owners" : "recent")}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          go(role === "admin" ? "owners" : "sessions")
                        }
                      >
                        {t("viewAll")}
                        <ArrowRight className="rtl:rotate-180" />
                      </Button>
                    </div>
                    {role === "admin"
                      ? shops.map((s) => (
                          <div key={s.id} className="info-row">
                            <div className="icon-tile">
                              <Store />
                            </div>
                            <div className="flex-1">
                              <h2>{s.name}</h2>
                              <p className="text-xs">{s.owner}</p>
                            </div>
                            <span className="status-pill">
                              {t(s.connected ? "connected" : "disconnected")}
                            </span>
                          </div>
                        ))
                      : sessions.map((s) => (
                          <button
                            key={s.id}
                            className="info-row w-full text-start hover:bg-muted"
                            onClick={() => go("sessions")}
                          >
                            <div className="icon-tile">{s.initials}</div>
                            <div className="flex-1">
                              <h2>{s.name}</h2>
                              <p className="text-xs">{t(s.intent)}</p>
                            </div>
                            <span className="status-pill">{t(s.mode)}</span>
                          </button>
                        ))}
                  </section>
                </>
              ) : page === "catalogue" ? (
                <Catalogue
                  products={products}
                  onChange={setProducts}
                  notify={setNotice}
                />
              ) : page === "sessions" ? (
                <Sessions
                  sessions={sessions}
                  setSessions={setSessions}
                  notify={setNotice}
                />
              ) : page === "support" ? (
                <Support
                  role={role}
                  shops={shops}
                  tickets={tickets}
                  setTickets={setTickets}
                  notify={setNotice}
                />
              ) : page === "owners" ? (
                <>
                  <Heading
                    title={t("ownersTitle")}
                    subtitle={t("ownersSub")}
                    action={
                      <Button onClick={() => setOwnerDialog(true)}>
                        <Plus />
                        {t("createOwner")}
                      </Button>
                    }
                  />
                  <div className="mb-5 flex max-w-sm items-center gap-3">
                    <Search className="size-5 text-muted-foreground" />
                    <Field
                      label={t("search")}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {shops
                      .filter((s) =>
                        (s.name + s.owner + s.email)
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((s) => (
                        <section className="surface p-6" key={s.id}>
                          <div className="icon-tile mb-4">
                            <Store />
                          </div>
                          <h2>{s.name}</h2>
                          <p className="mt-1 text-sm">{s.owner}</p>
                          <p className="mt-1 break-all text-xs">
                            <bdi>{s.email}</bdi>
                          </p>
                          <div className="my-4">
                            <Badge variant="secondary">
                              {t(s.connected ? "connected" : "disconnected")}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => go("support")}
                          >
                            {t("viewQueries")} ·{" "}
                            {tickets.filter((t) => t.shopId === s.id).length}
                          </Button>
                        </section>
                      ))}
                  </div>
                </>
              ) : page === "orders" ? (
                <>
                  <Heading title={t("ordersTitle")} subtitle={t("ordersSub")} />
                  <div className="grid gap-4 md:grid-cols-2">
                    {previewOrders.map((o) => (
                      <section className="surface p-6" key={o.id}>
                        <div className="flex justify-between">
                          <bdi className="text-xs text-muted-foreground">
                            {o.id}
                          </bdi>
                          <span className="status-pill">{t("draft")}</span>
                        </div>
                        <h2 className="mt-4">{o.name}</h2>
                        <p className="my-3 text-sm">{o.product}</p>
                        <Money value={o.price} />
                        <Button
                          className="mt-5 w-full"
                          variant="outline"
                          onClick={() => setOrderId(o.id)}
                        >
                          {t("review")}
                        </Button>
                      </section>
                    ))}
                  </div>
                </>
              ) : page === "followups" ? (
                <>
                  <Heading
                    title={t("followupsTitle")}
                    subtitle={t("followupsSub")}
                  />
                  <section className="surface p-6">
                    <h2>Ayesha Khan</h2>
                    <p className="my-4">{t("followupHint")}</p>
                    <Button variant="outline" onClick={() => go("sessions")}>
                      {t("review")}
                    </Button>
                  </section>
                </>
              ) : (
                <>
                  <Heading
                    title={t("settings")}
                    subtitle={t("disconnectHint")}
                  />
                  <div className="workspace-grid">
                    <section className="surface p-6">
                      <h2 className="mb-5">{t("changeLogin")}</h2>
                      <form
                        className="grid gap-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setNotice(t("notConnected"));
                        }}
                      >
                        <Field
                          label={t("email")}
                          type="email"
                          required
                          defaultValue="owner@example.com"
                        />
                        <Field
                          label={t("password")}
                          type="password"
                          autoComplete="off"
                          placeholder="••••••••"
                        />
                        <p className="text-xs">{t("credentialHint")}</p>
                        <Button>{t("save")}</Button>
                      </form>
                    </section>
                    <section className="surface p-6">
                      <h2>{t("connection")}</h2>
                      <div className="my-5 status-pill">
                        <ShieldCheck className="size-4" />
                        {t(connected ? "connected" : "disconnected")}
                      </div>
                      <p className="mb-5 text-sm">{t("disconnectHint")}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setConnected(false);
                          setStage("connection");
                          setFailed(false);
                        }}
                      >
                        {t("disconnect")}
                      </Button>
                    </section>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      )}
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent
          side={locale === "ur" ? "right" : "left"}
          showCloseButton={false}
        >
          <SheetHeader>
            <SheetTitle>{t("navigation")}</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            {nav}
            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setMobile(false)}
            >
              {t("close")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={ownerDialog} onOpenChange={setOwnerDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("createOwner")}</DialogTitle>
            <DialogDescription>{t("credentialHint")}</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setShops((s) => [
                ...s,
                {
                  id: crypto.randomUUID(),
                  name: String(f.get("shop")),
                  owner: String(f.get("owner")),
                  email: String(f.get("email")),
                  connected: false,
                },
              ]);
              setOwnerDialog(false);
              setNotice(t("ownerCreated"));
            }}
          >
            <Field label={t("shopName")} name="shop" required />
            <Field label={t("ownerName")} name="owner" required />
            <Field label={t("email")} name="email" type="email" required />
            <Field
              label={t("temporaryPassword")}
              type="password"
              minLength={8}
              required
              autoComplete="off"
            />
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOwnerDialog(false)}
              >
                {t("cancel")}
              </Button>
              <Button>{t("createOwner")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={orderId !== null}
        onOpenChange={(v) => {
          if (!v) setOrderId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{orderId}</DialogTitle>
            <DialogDescription>{t("confirmPending")}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOrderId(null)}>{t("close")}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Brand() {
  return (
    <div className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-5" />
      </span>
      <span className="text-lg">
        PocketSales <span className="text-primary">AI</span>
      </span>
    </div>
  );
}
function Nav({ items, current, go }: NavigationProps) {
  const t = useTranslations();
  return (
    <nav aria-label={t("navigation")} className="space-y-1">
      {items.map((item) => {
        const Icon = navigationIcons[item.icon];
        return (
          <button
            key={item.page}
            className={`sidebar-link ${current === item.page ? "selected" : ""}`}
            aria-current={current === item.page ? "page" : undefined}
            onClick={() => go(item.page)}
          >
            <Icon className="size-4" />
            {t(item.page)}
          </button>
        );
      })}
    </nav>
  );
}
function Attention({ icon, title, sub, onClick }: AttentionProps) {
  return (
    <button
      className="info-row w-full text-start hover:bg-muted"
      onClick={onClick}
    >
      <div className="icon-tile">{icon}</div>
      <div className="min-w-0 flex-1">
        <h2 className="text-sm">{title}</h2>
        <p className="mt-1 text-xs">{sub}</p>
      </div>
      <ChevronRight className="size-4 rtl:rotate-180" />
    </button>
  );
}
