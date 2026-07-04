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

  if (innerStatus === 429 || /rate.?limit|too many requests|platform overloaded|quota/i.test(lower)) {
    return "The AI service is overloaded with traffic right now. Please wait a minute and try again — your request didn't go through.";
  }
  if (innerStatus === 401 || innerStatus === 403 || /unauthorized|forbidden|invalid api key/i.test(lower)) {
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
