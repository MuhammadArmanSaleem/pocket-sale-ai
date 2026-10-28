"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heading, Field, Choice, Empty } from "@/components/shared";
import { ticketStatuses } from "@/lib/data";
import { SHOP_ID } from "@/lib/constants";
import type { SupportProps } from "@/lib/types";
export function Support({
  shopFilter,
  clearShopFilter,
  role,
  shops,
  tickets,
  setTickets,
  notify,
}: SupportProps) {
  const t = useTranslations();
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [reply, setReply] = useState("");
  const own = tickets.filter(
    (ti) =>
      (role === "admin" || ti.shopId === SHOP_ID) &&
      (!shopFilter || ti.shopId === shopFilter),
  );
  const filtered = own.filter((ti) => filter === "all" || ti.status === filter);
  const ticket = own.find((ti) => ti.id === selected);
  return (
    <>
      <Heading
        title={t("supportTitle")}
        subtitle={t("supportSub")}
        action={
          role === "owner" ? (
            <Button onClick={() => setOpen(true)}>
              <Plus />
              {t("newQuery")}
            </Button>
          ) : undefined
        }
      />
      {shopFilter && (
        <div className="mb-4 flex items-center gap-3">
          <span>{shops.find((s) => s.id === shopFilter)?.name}</span>
          <Button
            variant="outline"
            onClick={() => {
              clearShopFilter();
              setSelected(null);
            }}
          >
            {t("viewAll")}
          </Button>
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "secondary" : "ghost"}
          onClick={() => setFilter("all")}
        >
          {t("viewAll")}
        </Button>
        {ticketStatuses.map((s) => (
          <Button
            variant={filter === s ? "secondary" : "ghost"}
            key={s}
            onClick={() => setFilter(s)}
          >
            {t(s)}
          </Button>
        ))}
      </div>
      <section className="surface chat-grid overflow-hidden">
        <div className={`${ticket ? "hidden md:block" : ""} border-e`}>
          {filtered.map((ti) => (
            <button
              key={ti.id}
              className={`block w-full border-b p-5 text-start hover:bg-muted ${selected === ti.id ? "bg-secondary/60" : ""}`}
              onClick={() => {
                setSelected(ti.id);
                setReply("");
              }}
            >
              <div className="mb-2 flex justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  <bdi>#{ti.id}</bdi>
                </span>
                <span className="status-pill">{t(ti.status)}</span>
              </div>
              <h2 className="text-sm">{ti.subject}</h2>
              <p className="mt-2 text-xs">
                {shops.find((s) => s.id === ti.shopId)?.name}
              </p>
            </button>
          ))}
          {!filtered.length && <Empty />}
        </div>
        {ticket ? (
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div className="flex items-center gap-2">
                <Button
                  className="md:hidden"
                  variant="ghost"
                  size="icon"
                  aria-label={t("back")}
                  onClick={() => setSelected(null)}
                >
                  <ArrowLeft className="rtl:rotate-180" />
                </Button>
                <h2>{ticket.subject}</h2>
              </div>
              {role === "admin" ? (
                <Choice
                  label={t("status")}
                  value={ticket.status}
                  onChange={(v) => {
                    if (v === "open" || v === "waiting" || v === "resolved")
                      setTickets(
                        tickets.map((x) =>
                          x.id === ticket.id ? { ...x, status: v } : x,
                        ),
                      );
                  }}
                  options={ticketStatuses.map((value) => ({
                    value,
                    label: t(value),
                  }))}
                />
              ) : (
                <span className="status-pill">{t(ticket.status)}</span>
              )}
            </div>
            <div className="flex-1 space-y-4 bg-background p-5">
              {ticket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`conversation-bubble ${m.sender === role ? "outgoing" : ""}`}
                >
                  <div className="mb-2 text-xs font-semibold text-primary">
                    {t(m.sender === "admin" ? "supportTeam" : "owner")}
                  </div>
                  <div className="whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex gap-2 border-t p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                setTickets(
                  tickets.map((x) =>
                    x.id === ticket.id
                      ? {
                          ...x,
                          status: role === "admin" ? "waiting" : "open",
                          messages: [
                            ...x.messages,
                            {
                              id: crypto.randomUUID(),
                              sender: role,
                              text: reply.trim(),
                            },
                          ],
                        }
                      : x,
                  ),
                );
                setReply("");
                notify(t("replySaved"));
              }}
            >
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                aria-label={t("message")}
                placeholder={t("replyPlaceholder")}
                required
                maxLength={3000}
              />
              <Button aria-label={t("send")}>
                <Send className="rtl:rotate-180" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="empty m-auto p-6">{t("selectQuery")}</div>
        )}
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("newQuery")}</DialogTitle>
            <DialogDescription>{t("demoNotice")}</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const subject = String(f.get("subject") ?? "").trim(),
                text = String(f.get("message") ?? "").trim();
              if (!subject || !text) return;
              const id = crypto.randomUUID().slice(0, 8);
              setTickets([
                {
                  id,
                  shopId: SHOP_ID,
                  subject,
                  status: "open",
                  messages: [
                    { id: crypto.randomUUID(), sender: "owner", text },
                  ],
                },
                ...tickets,
              ]);
              setSelected(id);
              setOpen(false);
              notify(t("queryCreated"));
            }}
          >
            <Field
              label={t("subject")}
              name="subject"
              required
              maxLength={120}
            />
            <Label className="field">
              {t("message")}
              <Textarea name="message" required maxLength={3000} />
            </Label>
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button>{t("submit")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
