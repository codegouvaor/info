"use client";

import * as React from "react";
import { Headphones, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const EXTRA_OFFSET_PX = 16;
// Sit above the BackToTopButton so both floating widgets don't overlap.
const SUPPORT_ABOVE_BACK_TO_TOP_PX = 64;
// Match BackToTopButton's visibility threshold.
const VISIBILITY_SCROLL_PX = 600;

interface ChatMessage {
  id: string;
  text: string;
  author: "user" | "support";
}

export function SupportButton() {
  const t = useTranslations("Common.supportWidget");
  const [open, setOpen] = React.useState(false);
  // Bottom offset of the floating toggle button: rests at the bottom edge,
  // but rises above the BackToTopButton once that button becomes visible.
  const [bottomOffset, setBottomOffset] = React.useState(EXTRA_OFFSET_PX);

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "welcome", text: t("welcome"), author: "support" },
  ]);
  const [input, setInput] = React.useState("");
  const timersRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    let frameId = 0;

    const updateState = () => {
      frameId = 0;

      const consentBanner = document.querySelector<HTMLElement>('[data-consent-banner="true"]');
      const bannerHeight =
        consentBanner && consentBanner.offsetParent !== null
          ? consentBanner.getBoundingClientRect().height
          : 0;

      // Rise above the BackToTopButton only when it is actually shown.
      const viewportThreshold = window.innerHeight * 0.7;
      const backToTopVisible = window.scrollY > Math.max(VISIBILITY_SCROLL_PX, viewportThreshold);
      const baseOffset = bannerHeight + EXTRA_OFFSET_PX;
      const nextOffset = backToTopVisible
        ? baseOffset + SUPPORT_ABOVE_BACK_TO_TOP_PX
        : baseOffset;

      setBottomOffset((current) => (current === nextOffset ? current : nextOffset));
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateState);
    };

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, open]);

  // Chat window sits above the floating toggle button.
  const chatBottom = bottomOffset + 52;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, text, author: "user" };
    setMessages((current) => [...current, userMessage]);
    setInput("");

    // UI-only: no backend. Acknowledge receipt after a short delay.
    const timer = window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `support-${Date.now()}`,
        text: t("autoReply"),
        author: "support",
      };
      setMessages((current) => [...current, reply]);
    }, 800);

    timersRef.current.push(timer);
  };

  return (
    <>
      {/* Chat window */}
      <div
        role="dialog"
        aria-label={t("title")}
        className={cn(
          "fixed right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-xl backdrop-blur transition-all duration-200 sm:right-6 sm:w-96",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
        style={{ bottom: `${chatBottom}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Headphones className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{t("title")}</p>
              <p className="text-xs text-muted-foreground">{t("online")}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={t("closeChat")}
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex max-h-72 min-h-56 flex-col gap-2 overflow-y-auto p-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                message.author === "user"
                  ? "self-end rounded-br-sm bg-primary text-primary-foreground"
                  : "self-start rounded-bl-sm bg-muted text-foreground",
              )}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border/70 p-3">
          <label htmlFor="support-chat-input" className="sr-only">
            {t("inputPlaceholder")}
          </label>
          <input
            id="support-chat-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("inputPlaceholder")}
            className="h-10 min-w-0 flex-1 rounded-full border border-border/70 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          />
          <button
            type="submit"
            aria-label={t("send")}
            disabled={!input.trim()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Floating toggle button */}
      <button
        type="button"
        aria-label={t("ariaLabel")}
        aria-expanded={open}
        title={t("label")}
        onClick={() => setOpen((current) => !current)}
        className="fixed right-4 z-40 inline-flex items-center justify-center rounded-full border border-border/70 bg-background/92 p-3 text-foreground shadow-sm backdrop-blur transition-all duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 sm:right-6"
        style={{ bottom: `${bottomOffset}px` }}
      >
        <Headphones className="h-5 w-5 shrink-0" aria-hidden="true" />
      </button>
    </>
  );
}