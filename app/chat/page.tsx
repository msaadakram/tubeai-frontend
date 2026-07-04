"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  Square,
  ArrowUp,
  Trash2,
  Bot,
  User as UserIcon,
  AlertTriangle,
  Hash,
  Tag as TagIcon,
  Type,
  FileText,
  Search,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { friendlyApiError } from "@/lib/apiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tubeai-backend.vercel.app";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string };

const STORAGE_KEY = "ytforge.chat.history";

const STARTERS = [
  {
    icon: Type,
    title: "Roast my video idea",
    prompt:
      "I'm planning a YouTube video about [your topic]. What angle would actually get clicks, and what mistake are most creators making on this topic?",
  },
  {
    icon: Search,
    title: "Why am I not growing?",
    prompt:
      "My channel makes videos about [niche] and growth has stalled around [subs/views]. Walk me through what to diagnose first.",
  },
  {
    icon: FileText,
    title: "Write me a 30s hook",
    prompt:
      "Write a 30-second opening hook for a video titled [your title]. Give me 3 versions and explain which retention trick each one uses.",
  },
  {
    icon: TagIcon,
    title: "Plan my next 4 videos",
    prompt:
      "My channel is about [niche]. Suggest my next 4 video ideas as a progression that builds on each other, with a one-line thumbnail concept for each.",
  },
];

const QUICK_LINKS = [
  { label: "Tag Generator", href: "/tools/tag-generator", icon: TagIcon },
  { label: "Hashtag Generator", href: "/tools/hashtag-generator", icon: Hash },
  { label: "Title Generator", href: "/tools/viral-title-generator", icon: Type },
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
      )
      .slice(-50);
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
  } catch {}
}

// Minimal, safe markdown rendering: bold, inline code, line breaks, basic lists.
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (!line.trim()) {
      out.push(<div key={i} className="h-2" />);
      return;
    }
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((seg, j) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return (
          <strong key={j} className="font-black">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      if (seg.startsWith("`") && seg.endsWith("`")) {
        return (
          <code
            key={j}
            className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-[0.85em] font-mono"
          >
            {seg.slice(1, -1)}
          </code>
        );
      }
      return <span key={j}>{seg}</span>;
    });

    const isOrdered = /^\s*\d+\.\s+/.test(line);
    const isBullet = /^\s*[-*]\s+/.test(line);
    if (isOrdered) {
      out.push(
        <div key={i} className="flex gap-2">
          <span className="font-black text-red-600 shrink-0">
            {line.match(/^\s*(\d+)\./)?.[1]}.
          </span>
          <span>{parts}</span>
        </div>
      );
    } else if (isBullet) {
      out.push(
        <div key={i} className="flex gap-2">
          <span className="text-red-600 shrink-0 mt-1">•</span>
          <span>{parts}</span>
        </div>
      );
    } else {
      out.push(<p key={i}>{parts}</p>);
    }
  });

  return <div className="space-y-0.5 leading-relaxed">{out}</div>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveHistory(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const autosize = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  useEffect(() => {
    autosize();
  }, [input]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  const send = useCallback(
    async (raw?: string) => {
      const content = (raw ?? input).trim();
      if (!content || streaming) return;

      setInput("");
      setError(null);

      const userMsg: Message = { id: uid(), role: "user", content };
      const assistantMsg: Message = { id: uid(), role: "assistant", content: "" };
      const history = [...messages, userMsg];
      setMessages([...history, assistantMsg]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const txt = await res.text().catch(() => "");
          throw new Error(friendlyApiError(txt, res.status));
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split("\n\n");
          buffer = frames.pop() || "";

          for (const frame of frames) {
            const lines = frame.split("\n");
            let event = "message";
            const dataLines: string[] = [];
            for (const ln of lines) {
              if (ln.startsWith("event:")) event = ln.slice(6).trim();
              else if (ln.startsWith("data:")) dataLines.push(ln.slice(5).trim());
            }
            if (!dataLines.length) continue;
            const data = dataLines.join("\n");

            if (event === "done") {
              break;
            } else if (event === "error") {
              try {
                const j = JSON.parse(data);
                throw new Error(j.message || "Streaming error");
              } catch (e) {
                throw e instanceof Error ? e : new Error(data);
              }
            } else if (event === "delta") {
              try {
                const j = JSON.parse(data);
                if (typeof j.content === "string") {
                  acc += j.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsg.id ? { ...m, content: acc } : m
                    )
                  );
                }
              } catch {}
            }
          }
        }

        if (!acc.trim()) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? {
                    ...m,
                    content:
                      "I didn't get a response back that time. Please try again.",
                  }
                : m
            )
          );
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content || "_Stopped._" }
                : m
            )
          );
        } else {
          setError(err?.message || "Something went wrong.");
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [input, messages, streaming]
  );

  const clearChat = () => {
    stop();
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const empty = messages.length === 0;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-10">
          <div className="flex items-center gap-2 text-white/80 text-[11px] font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            YTForge AI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Your YouTube growth coach
          </h1>
          <p className="mt-3 text-white/90 text-sm sm:text-base font-medium max-w-2xl">
            Ask anything about your channel, scripts, thumbnails, SEO, or growth
            strategy. Get specific, actionable answers — streamed live.
          </p>
        </div>
      </section>

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-6 space-y-5"
        >
          {empty ? (
            <div className="max-w-2xl mx-auto w-full pt-4">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-red-600" />
                  <div className="font-black text-sm">How can I help you grow?</div>
                </div>
                <p className="text-sm text-neutral-600">
                  Pick a starting point or type your own question. I&apos;ll
                  diagnose, then give you something you can act on for your next
                  video.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTERS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => send(s.prompt)}
                    className="group text-left bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:border-red-600 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <s.icon className="w-4 h-4 text-red-600" />
                      <div className="font-black text-sm">{s.title}</div>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {s.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center ${
                      m.role === "user"
                        ? "bg-neutral-200 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {m.role === "user" ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl border-2 border-black text-sm ${
                      m.role === "user"
                        ? "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {m.content ? (
                      renderMarkdown(m.content)
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-neutral-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse [animation-delay:0.3s]" />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 bg-white border-t-2 border-black py-3">
          {!empty && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {QUICK_LINKS.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-full border-2 border-black bg-white hover:bg-red-50 transition"
                  >
                    <q.icon className="w-3 h-3" />
                    {q.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={clearChat}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-full border-2 border-black bg-white hover:bg-neutral-100 transition"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}
          <div className="flex items-end gap-2 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 focus-within:border-red-600 transition">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask about your channel, script, thumbnail, SEO…"
              className="flex-1 resize-none bg-transparent outline-none text-sm font-medium py-2 px-2 max-h-[200px]"
            />
            {streaming ? (
              <button
                onClick={stop}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl border-2 border-black bg-neutral-800 text-white hover:bg-black transition"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            ) : (
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl border-2 border-black bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Send
              </button>
            )}
          </div>
          <p className="text-[10px] text-neutral-400 font-medium mt-1.5 text-center">
            YTForge AI can be wrong — verify important advice before you ship.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
