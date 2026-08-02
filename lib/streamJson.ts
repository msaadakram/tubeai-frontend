"use client";

/**
 * Consumes a Server-Sent Events stream from the tubeai-backend `/stream`
 * JSON endpoints. The backend emits:
 *   - event: delta  data: { content: string }
 *   - event: done   data: { result: any, raw: string } | { error: string, raw: string }
 *   - event: error  data: { message: string }
 *
 * Mirrors the throttled-flush approach used by PageRating so per-token
 * re-renders stay cheap. Returns an AbortController so the caller can cancel.
 */

import { getTurnstileSessionId } from "@/lib/turnstile/turnstile-header-bridge";

export type StreamJsonHandlers<T> = {
  onDelta?: (full: string, delta: string) => void;
  onDone?: (result: T | null, raw: string, error?: string) => void;
  onError?: (message: string) => void;
};

/** Optional extra headers to merge into the stream request (post-token + ts). */
export type StreamJsonOptions = {
  headers?: Record<string, string>;
};

const FLUSH_MS = 60;

export function streamJson<T = unknown>(
  url: string,
  body: unknown,
  handlers: StreamJsonHandlers<T>,
  options?: StreamJsonOptions
): AbortController {
  const abort = new AbortController();

  (async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      };
      try {
        const token = localStorage.getItem("ytforge.token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {
        /* localStorage unavailable */
      }
      // Attach the app-level Turnstile session id so tool endpoints behind
      // `requireTurnstileSession` accept the streaming request. The session
      // id is held in `<TurnstileSessionProvider>` and pushed here via the
      // cross-module side-channel (no React-context access from non-component).
      const tsSession = getTurnstileSessionId();
      if (tsSession) headers["X-Turnstile-Session"] = tsSession;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: abort.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        handlers.onError?.(errBody.error || `Request failed (${res.status})`);
        return;
      }

      if (!res.body) {
        handlers.onError?.("No response stream from server.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let sseBuffer = "";
      let reply = "";
      let flushTimer: ReturnType<typeof setTimeout> | null = null;
      let lastFlush = 0;

      const commit = () => {
        flushTimer = null;
        lastFlush = Date.now();
        handlers.onDelta?.(reply, "");
      };
      const scheduleFlush = () => {
        if (flushTimer) return;
        flushTimer = setTimeout(commit, FLUSH_MS);
      };
      const cancelFlush = () => {
        if (flushTimer) {
          clearTimeout(flushTimer);
          flushTimer = null;
        }
      };

      const finish = () => {
        cancelFlush();
        handlers.onDelta?.(reply, "");
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const events = sseBuffer.split("\n\n");
          sseBuffer = events.pop() || "";

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
              if (!lastFlush || Date.now() - lastFlush >= FLUSH_MS) {
                lastFlush = Date.now();
                handlers.onDelta?.(reply, parsed.content);
              } else {
                scheduleFlush();
              }
            } else if (eventType === "done") {
              finish();
              handlers.onDone?.(parsed.result ?? null, parsed.raw ?? reply, parsed.error);
              return;
            } else if (eventType === "error") {
              finish();
              handlers.onError?.(parsed.message || "Streaming interrupted");
              return;
            }
          }
        }

        finish();
        handlers.onDone?.(null, reply, "Stream ended without completion");
      } catch (err) {
        cancelFlush();
        const aborted = err instanceof DOMException && err.name === "AbortError";
        if (!aborted) {
          handlers.onError?.(err instanceof Error ? err.message : "Stream failed");
        }
      }
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      if (!aborted) {
        handlers.onError?.(err instanceof Error ? err.message : "Request failed");
      }
    }
  })();

  return abort;
}
