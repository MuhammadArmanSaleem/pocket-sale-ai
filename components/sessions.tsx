"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "./shared";
import type { SessionsProps } from "@/lib/types";
export function Sessions({ sessions, setSessions, notify }: SessionsProps) {
  const t = useTranslations();
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const s = sessions.find((s) => s.id === selected);
  return (
    <>
      <Heading title={t("sessionsTitle")} subtitle={t("sessionsSub")} />
      <section className="surface chat-grid overflow-hidden">
        <div className={`${s ? "hidden md:block" : ""} border-e`}>
          {sessions.map((c) => (
            <button
              className={`flex w-full gap-3 border-b p-5 text-start hover:bg-muted ${c.id === selected ? "bg-secondary/60" : ""}`}
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                setReply("");
              }}
            >
              <div className="icon-tile">{c.initials}</div>
              <div>
                <h2 className="text-sm">{c.name}</h2>
                <p className="my-1 text-xs">{t(c.intent)}</p>
                <span className="status-pill">{t(c.mode)}</span>
              </div>
            </button>
          ))}
        </div>
        {s ? (
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t("back")}
                  onClick={() => setSelected(null)}
                >
                  <ArrowLeft className="rtl:rotate-180" />
                </Button>
                <h2>{s.name}</h2>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setSessions(
                    sessions.map((x) =>
                      x.id === s.id
                        ? { ...x, mode: x.mode === "ai" ? "seller" : "ai" }
                        : x,
                    ),
                  )
                }
              >
                {t(s.mode === "ai" ? "takeOver" : "resume")}
              </Button>
            </div>
            <div className="flex-1 space-y-4 bg-background p-5">
              {s.messages.map((m) => (
                <div
                  key={m.id}
                  className={`conversation-bubble ${m.sender !== "customer" ? "outgoing" : ""}`}
                >
                  <div className="mb-2 text-xs font-semibold text-primary">
                    {t(
                      m.sender === "customer"
                        ? "customer"
                        : m.sender === "ai"
                          ? "assistant"
                          : "you",
                    )}
                  </div>
                  <div className="whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t px-5 py-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              {t("approval")}
            </div>
            <form
              className="flex gap-2 border-t p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (s.mode !== "seller" || !reply.trim()) return;
                setSessions(
                  sessions.map((x) =>
                    x.id === s.id
                      ? {
                          ...x,
                          messages: [
                            ...x.messages,
                            {
                              id: crypto.randomUUID(),
                              sender: "seller",
                              text: reply.trim(),
                            },
                          ],
                        }
                      : x,
                  ),
                );
                setReply("");
                notify(t("localReply"));
              }}
            >
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={t(
                  s.mode === "ai" ? "pauseHint" : "replyPlaceholder",
                )}
                aria-label={t("message")}
                required
                disabled={s.mode === "ai"}
              />
              <Button aria-label={t("send")} disabled={s.mode === "ai"}>
                <Send className="rtl:rotate-180" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="empty m-auto p-6">{t("sessionsSub")}</div>
        )}
      </section>
    </>
  );
}
