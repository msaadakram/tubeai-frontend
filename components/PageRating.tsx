"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Star, X, MessageSquare, Check, Sparkles, ThumbsUp, Loader2, AlertTriangle, MessageCircle, Send, Bot, Plus } from "lucide-react";

const STORAGE_KEY = "ytforge_page_ratings_v1";
const BASE_URL = "https://tubeai-backend.vercel.app";

type Ratings = Record<string, { rating: number; feedback?: string; at: number }>;

function readRatings(): Ratings {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeRatings(r: Ratings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

const QUICK_TAGS = [
  "Easy to use",
  "Accurate results",
  "Fast",
  "Beautiful design",
  "Saved me time",
  "Could be better",
];

export function PageRating() {
  const pathname = usePathname();
  const pageKey = pathname;

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // AI Chat state
  type ChatMsg = { id: string; role: "user" | "bot"; text: string };
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! I'm the YTForge assistant 👋 Ask me anything about growing your YouTube channel, our tools, or how to get more views.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading, chatOpen]);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text };
    const history = [...chatMessages, userMsg];
    setChatMessages(history);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      console.log("[AI Chat] POST", `${BASE_URL}/api/chat`);
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      console.log("[AI Chat] status", res.status, res.headers.get("content-type"));
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      if (!res.body) throw new Error("No response stream from server.");

      // Server-Sent Events stream: accumulate `delta` events into the reply,
      // streaming each token into the UI as it arrives.
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let reply = "";
      const botId = `b-${Date.now()}`;

      const pushBot = () =>
        setChatMessages((prev) => {
          const exists = prev.some((m) => m.id === botId);
          return exists
            ? prev.map((m) => (m.id === botId ? { ...m, text: reply } : m))
            : [...prev, { id: botId, role: "bot", text: reply }];
        });

      pushBot();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const block of events) {
          const lines = block.split("\n");
          let eventType = "";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event:")) eventType = line.slice(6).trim();
            else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;

          let parsed: any = {};
          try {
            parsed = JSON.parse(dataStr);
          } catch {
            continue;
          }

          if (eventType === "delta" && typeof parsed.content === "string") {
            reply += parsed.content;
            pushBot();
          } else if (eventType === "error") {
            throw new Error(parsed.message || "Streaming interrupted");
          }
        }
      }

      if (!reply.trim()) throw new Error("Empty response from server.");
      console.log("[AI Chat] complete", reply.length, "chars");
    } catch (err) {
      console.error("[AI Chat] error", err);
      setChatError(
        err instanceof Error ? err.message : "Couldn't reach the assistant. Try again."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [pulseAttention, setPulseAttention] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state on page change
  useEffect(() => {
    const ratings = readRatings();
    const prior = ratings[pageKey];
    if (prior) {
      setAlreadyRated(true);
      setStars(prior.rating);
      setFeedback(prior.feedback || "");
    } else {
      setAlreadyRated(false);
      setStars(0);
      setFeedback("");
      setTags([]);
    }
    setSubmitted(false);
    setOpen(false);
    setMenuOpen(false);
    setError(null);
    setSubmitting(false);

    // Pulse the FAB after 8s on first visit to draw attention
    if (!prior) {
      const t = setTimeout(() => setPulseAttention(true), 8000);
      const t2 = setTimeout(() => setPulseAttention(false), 14000);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [pageKey]);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const submit = async () => {
    if (stars === 0 || submitting) return;
    setSubmitting(true);
    setError(null);

    const stoodOut = tags.join(", ").slice(0, 500);
    const tellUsMore = feedback.trim().slice(0, 2000);

    try {
      const res = await fetch(`${BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: stars,
          ...(stoodOut ? { stoodOut } : {}),
          ...(tellUsMore ? { tellUsMore } : {}),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Failed to submit (${res.status})`);
      }

      const ratings = readRatings();
      const fullFeedback = [stoodOut, tellUsMore].filter(Boolean).join(" — ");
      ratings[pageKey] = { rating: stars, feedback: fullFeedback, at: Date.now() };
      writeRatings(ratings);

      setSubmitted(true);
      setAlreadyRated(true);
      setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayStars = hoverStars || stars;

  const ratingLabel =
    displayStars === 0
      ? "Tap a star"
      : displayStars === 1
      ? "Poor"
      : displayStars === 2
      ? "Fair"
      : displayStars === 3
      ? "Good"
      : displayStars === 4
      ? "Great"
      : "Excellent";

  return (
    <>
      {/* Floating speed-dial */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3">
        {/* Fan-out options */}
        <AnimatePresence>
          {menuOpen && !open && !chatOpen && (
            <motion.div
              key="dial"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
              }}
              className="flex flex-col items-end gap-3"
            >
              {/* AI Chat option */}
              <motion.button
                variants={{
                  hidden: { scale: 0, opacity: 0, y: 12 },
                  show: { scale: 1, opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                onClick={() => {
                  setMenuOpen(false);
                  setChatOpen(true);
                }}
                aria-label="Open AI chat"
                className="group flex items-center gap-2.5"
              >
                <span className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] whitespace-nowrap">
                  AI Chat
                </span>
                <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </span>
              </motion.button>

              {/* Review option */}
              <motion.button
                variants={{
                  hidden: { scale: 0, opacity: 0, y: 12 },
                  show: { scale: 1, opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                onClick={() => {
                  setMenuOpen(false);
                  setOpen(true);
                }}
                aria-label="Rate this page"
                className="group flex items-center gap-2.5"
              >
                <span className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] whitespace-nowrap">
                  {alreadyRated ? "Edit Rating" : "Review"}
                </span>
                <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white text-red-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all">
                  <Star className="w-5 h-5 fill-red-600" />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main trigger */}
        <AnimatePresence>
          {!open && !chatOpen && (
            <motion.button
              key="fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="group relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white p-1.5 pr-1.5 sm:pl-2 sm:pr-4 sm:py-2 rounded-full border-2 border-black shadow-[0_8px_24px_-6px_rgba(220,38,38,0.55),4px_4px_0px_0px_rgba(220,38,38,1)] hover:shadow-[0_12px_30px_-6px_rgba(220,38,38,0.7),6px_6px_0px_0px_rgba(220,38,38,1)] transition-all overflow-hidden"
            >
              {/* Soft pulsing halo */}
              {pulseAttention && !alreadyRated && !menuOpen && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-600/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-600/20"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}

              {/* Glossy shine sweep on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Icon medallion */}
              <motion.div
                animate={{ rotate: menuOpen ? 135 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="relative flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-white shadow-[0_2px_8px_-1px_rgba(0,0,0,0.6)] shrink-0"
              >
                {/* Inner sheen */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-60" />
                {menuOpen ? (
                  <Plus className="relative w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <Sparkles className="relative w-4 h-4 sm:w-3.5 sm:h-3.5 fill-white text-white drop-shadow" />
                )}
              </motion.div>

              <span className="relative hidden sm:inline text-xs font-black uppercase tracking-wider whitespace-nowrap">
                {menuOpen ? "Close" : "AI"}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="fixed left-1/2 -translate-x-1/2 bottom-0 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 w-full sm:w-[400px] max-w-md z-[80]"
            >
              <div className="relative bg-white border-2 border-black sm:rounded-2xl rounded-t-2xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] overflow-hidden flex flex-col h-[80vh] sm:h-[560px]">
                {/* Header */}
                <div className="relative bg-black text-white p-4 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600 border-2 border-white">
                      <Bot className="w-5 h-5" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-tight leading-none">YTForge Assistant</h3>
                      <p className="text-[10px] text-neutral-300 mt-1">Online · usually replies instantly</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    aria-label="Close chat"
                    className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                  {chatMessages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.role === "bot" && (
                        <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white border-2 border-black">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed border-2 border-black ${
                          m.role === "user"
                            ? "bg-red-600 text-white rounded-2xl rounded-br-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-neutral-800 rounded-2xl rounded-bl-sm shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}

                  {chatLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2 justify-start"
                    >
                      <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white border-2 border-black">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white border-2 border-black rounded-2xl rounded-bl-sm px-4 py-3 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
                        <div className="flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-red-600"
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {chatError && (
                    <div className="flex items-start gap-2 p-2.5 bg-red-50 border-2 border-red-600 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-red-800 leading-snug">{chatError}</p>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t-2 border-black bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendChat();
                        }
                      }}
                      rows={1}
                      placeholder="Ask me anything…"
                      className="flex-1 resize-none max-h-28 px-3.5 py-2.5 text-sm bg-neutral-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white focus:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-all"
                    />
                    <button
                      onClick={sendChat}
                      disabled={!chatInput.trim() || chatLoading}
                      aria-label="Send message"
                      className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none disabled:translate-y-0 transition-all"
                    >
                      {chatLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-neutral-400 mt-2">
                    Powered by YTForge · Enter to send
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-[calc(100%-2rem)] max-w-md z-[80]"
            >
              <div className="relative bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] overflow-hidden">
                {/* Header */}
                <div className="relative bg-black text-white p-5 sm:p-6 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                      maskImage: "radial-gradient(ellipse at top right, black 30%, transparent 80%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse at top right, black 30%, transparent 80%)",
                    }}
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white mb-2">
                        <Sparkles className="w-2.5 h-2.5" /> Your Feedback
                      </div>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight">
                        {submitted
                          ? "Thanks for rating!"
                          : alreadyRated
                          ? "Update your rating"
                          : "How was this page?"}
                      </h3>
                      <p className="text-xs text-neutral-300 mt-1">
                        {submitted
                          ? "Your feedback helps us improve YTForge."
                          : "Takes 10 seconds. No signup required."}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="thanks"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-4"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4"
                        >
                          <Check className="w-9 h-9 text-white" strokeWidth={3} />
                        </motion.div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-5 h-5 ${
                                s <= stars
                                  ? "fill-red-600 text-red-600"
                                  : "fill-neutral-200 text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-bold text-neutral-700">
                          You rated us <span className="text-red-600">{stars} / 5</span>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Stars */}
                        <div className="flex flex-col items-center mb-5">
                          <div className="flex items-center gap-1 sm:gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => {
                              const active = s <= displayStars;
                              return (
                                <button
                                  key={s}
                                  onClick={() => setStars(s)}
                                  onMouseEnter={() => setHoverStars(s)}
                                  onMouseLeave={() => setHoverStars(0)}
                                  aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                                  className="p-1.5 transition-transform hover:scale-110 active:scale-95"
                                >
                                  <motion.div
                                    animate={{ scale: active ? 1.05 : 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 14 }}
                                  >
                                    <Star
                                      className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                        active
                                          ? "fill-red-600 text-red-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                          : "fill-neutral-200 text-neutral-300"
                                      }`}
                                      strokeWidth={2}
                                    />
                                  </motion.div>
                                </button>
                              );
                            })}
                          </div>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={ratingLabel}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className={`text-xs font-black uppercase tracking-widest ${
                                displayStars >= 4
                                  ? "text-red-600"
                                  : displayStars >= 3
                                  ? "text-orange-500"
                                  : displayStars >= 1
                                  ? "text-neutral-600"
                                  : "text-neutral-400"
                              }`}
                            >
                              {ratingLabel}
                            </motion.span>
                          </AnimatePresence>
                        </div>

                        {/* Quick tags */}
                        <AnimatePresence>
                          {stars > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mb-4">
                                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-2">
                                  What stood out? (optional)
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {QUICK_TAGS.map((tag) => {
                                    const active = tags.includes(tag);
                                    return (
                                      <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`text-[11px] font-black px-2.5 py-1 rounded-full border-2 transition-all ${
                                          active
                                            ? "bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                            : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                                        }`}
                                      >
                                        {tag}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Comment */}
                              <div className="mb-5">
                                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-2">
                                  <MessageSquare className="w-3 h-3" /> Tell us more (optional)
                                </label>
                                <textarea
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  rows={3}
                                  maxLength={280}
                                  placeholder="What can we improve?"
                                  className="w-full px-3 py-2.5 text-sm bg-neutral-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white focus:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-all resize-none"
                                />
                                <div className="text-[10px] text-right text-neutral-400 mt-1 tabular-nums">
                                  {feedback.length}/280
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Error */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -4, height: 0 }}
                              className="overflow-hidden mb-3"
                            >
                              <div className="flex items-start gap-2 p-2.5 bg-red-50 border-2 border-red-600 rounded-lg">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-red-800 leading-snug">{error}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                          onClick={submit}
                          disabled={stars === 0 || submitting}
                          className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm px-4 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none disabled:translate-y-0 transition-all"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="w-4 h-4" />
                              {stars === 0 ? "Pick a rating" : "Submit Feedback"}
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-center text-neutral-400 mt-2">
                          Anonymous · no signup required
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
