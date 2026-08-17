export function friendlyApiError(raw: string, status: number): string {
  const text = (raw || "").trim();

  // Backend often wraps the AI provider error as:
  // "AI API error 429: {"error":{"message":"Platform overloaded. Please try again later.","type":"rate_limit_exceeded_error"},...}"
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  let innerMessage = text;
  let innerStatus = status;
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      innerMessage =
        parsed?.error?.message || parsed?.message || parsed?.error || text;
      if (parsed?.status_code) innerStatus = parsed.status_code;
    } catch {
      /* keep raw */
    }
  }

  const lower = innerMessage.toLowerCase();

  // A 401/403 from the Turnstile security gate is NOT an AI-service auth
  // problem — the endpoint may not even use AI (e.g. /api/monetization only
  // calls the public YouTube Data API). Surface the backend's actual, actionable
  // message instead of mislabeling it as "couldn't authenticate with the AI
  // service".
  if (/security check|turnstile|captcha|human verification|bot protection/i.test(lower)) {
    return innerMessage && innerMessage !== text
      ? innerMessage
      : "Please complete the security check before using this tool.";
  }

  // A 403 whose body is a CORS/origin rejection is a server-side allowlist
  // problem, NOT an AI-service auth issue. The backend's global error handler
  // emits "CORS: origin ... is not allowed" when a frontend origin is missing
  // from its allowlist — label that truthfully instead of as an AI failure.
  if (innerStatus === 403 && /cors:|origin.*not allowed|is not allowed/i.test(lower)) {
    return "The server rejected this request from your browser (cross-origin policy). Please try again shortly — our team has been notified.";
  }

  if (innerStatus === 429 || /rate.?limit|too many requests|platform overloaded|quota/i.test(lower)) {
    return "The AI service is overloaded with traffic right now. Please wait a minute and try again — your request didn't go through.";
  }

  // A 401/403 from a Turnstile-gated endpoint with an EMPTY (or non-JSON)
  // body is a session expiry, NOT an AI-service auth failure. `res.json()`
  // returning `{}` (e.g. a Vercel-edge error page or a malformed response)
  // leaves `innerMessage` empty — labeling that as "couldn't authenticate
  // with the AI service" sends the user down entirely the wrong path when
  // the real fix is "complete the security check again".
  if ((innerStatus === 401 || innerStatus === 403) && !innerMessage) {
    return "Please complete the security check before using this tool.";
  }

  // Only label as an AI-service auth failure when there is actual evidence
  // the call hit an authenticating third party: a non-empty body carrying a
  // 401/403, or explicit auth keywords. A bare 401/403 status with no body is
  // handled above (Turnstile session expiry); with a body but no security or
  // CORS signal it is a genuine vendor auth rejection.
  if ((innerMessage && (innerStatus === 401 || innerStatus === 403)) || /unauthorized|forbidden|invalid api key/i.test(lower)) {
    return "We couldn't authenticate with the AI service. Our team has been notified — please try again shortly.";
  }
  if (innerStatus === 400 || /bad request|invalid request/i.test(lower)) {
    return "The request couldn't be processed. Double-check your input and try again.";
  }
  if (innerStatus >= 500 || /server error|internal error|bad gateway|gateway timeout|service unavailable/i.test(lower)) {
    return "Our servers hit a snag. Please give it a moment and retry.";
  }
  if (/timeout|timed out|deadline exceeded/i.test(lower)) {
    return "The AI took too long to respond. Please try again — it usually works on the second attempt.";
  }
  if (/network|fetch failed|failed to fetch|networkerror/i.test(lower)) {
    return "Network connection issue. Check your internet and try again.";
  }

  if (innerMessage && innerMessage !== text) return innerMessage;
  return text || "Something went wrong. Please try again.";
}

export function isOverloadedError(raw: string, status: number): boolean {
  return status === 429 || /platform overloaded|rate.?limit|too many requests/i.test(raw || "");
}
