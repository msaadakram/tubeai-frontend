/**
 * Incremental partial-JSON extractors for streaming tool responses.
 *
 * The backend streams an AI JSON response token-by-token. We want to surface
 * completed array elements to the UI *as they arrive* — without waiting for
 * the whole JSON document to finish. These helpers scan a possibly-incomplete
 * JSON string and return whatever array elements (or scalar fields) are
 * already complete.
 *
 * They are intentionally tolerant: leading code fences, trailing commas,
 * unclosed brackets, and partial trailing values are all handled.
 */

function stripCodeFences(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

function unquoteString(s: string): string {
  // s begins with `"` and may or may not have a closing `" yet.
  let out = "";
  for (let i = 1; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\") {
      const next = s[i + 1];
      if (next === undefined) break;
      const map: Record<string, string> = {
        n: "\n",
        t: "\t",
        r: "\r",
        '"': '"',
        "\\": "\\",
        "/": "/",
        b: "\b",
        f: "\f",
      };
      out += map[next] ?? next;
      i++;
      continue;
    }
    if (ch === '"') break; // closing quote
    out += ch;
  }
  return out;
}

function skipWs(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

/**
 * Extract a complete JSON value (string, number, boolean, null, or nested
 * array/object) starting at index i. Returns { value, next } where next is the
 * index past the value, or { value: null, next: i, partial: true } if the
 * value isn't yet complete. Strings without a closing quote are returned as
 * partial-but-usable (the trailing value is still surfaced).
 */
function readValue(
  s: string,
  i: number
): { value: unknown; next: number; partial?: boolean } {
  i = skipWs(s, i);
  if (i >= s.length) return { value: null, next: i, partial: true };
  const ch = s[i];

  if (ch === '"') {
    // Find closing quote, respecting escapes.
    let j = i + 1;
    while (j < s.length) {
      if (s[j] === "\\") {
        j += 2;
        continue;
      }
      if (s[j] === '"') {
        return { value: unquoteString(s.slice(i, j + 1)), next: j + 1 };
      }
      j++;
    }
    // No closing quote yet — use what we have as a partial string.
    return { value: unquoteString(s.slice(i)), next: s.length, partial: true };
  }

  if (ch === "[") return readArray(s, i);
  if (ch === "{") return readObject(s, i);

  // number / true / false / null — read until delimiter
  let j = i;
  while (j < s.length && /[^\s,}\]]/.test(s[j])) j++;
  const raw = s.slice(i, j);
  let value: unknown = raw;
  if (raw === "true") value = true;
  else if (raw === "false") value = false;
  else if (raw === "null") value = null;
  else if (raw !== "" && !isNaN(Number(raw))) value = Number(raw);
  const partial = j >= s.length && /[.\d-]/.test(ch) && !raw.endsWith("e") && !/^\d+$/.test(raw) === false && j < s.length ? false : j >= s.length;
  return { value, next: j, partial };
}

function readArray(
  s: string,
  i: number
): { value: unknown[]; next: number; partial?: boolean } {
  // s[i] === '['
  i++;
  const out: unknown[] = [];
  i = skipWs(s, i);
  if (i < s.length && s[i] === "]") return { value: out, next: i + 1 };

  while (i < s.length) {
    const { value, next, partial } = readValue(s, i);
    if (partial) {
      // Last element still streaming — include strings (usable) but bail on
      // incomplete non-strings to avoid junk.
      if (typeof value === "string" && value.length > 0) out.push(value);
      return { value: out, next: s.length, partial: true };
    }
    out.push(value);
    i = skipWs(s, next);
    if (i < s.length && s[i] === ",") {
      i++;
      i = skipWs(s, i);
      continue;
    }
    if (i < s.length && s[i] === "]") return { value: out, next: i + 1 };
    if (i >= s.length) return { value: out, next: s.length, partial: true };
    // Unexpected char — bail.
    return { value: out, next: s.length, partial: true };
  }
  return { value: out, next: s.length, partial: true };
}

function readObject(
  s: string,
  i: number
): { value: Record<string, unknown>; next: number; partial?: boolean } {
  // s[i] === '{'
  i++;
  const out: Record<string, unknown> = {};
  i = skipWs(s, i);
  if (i < s.length && s[i] === "}") return { value: out, next: i + 1 };

  while (i < s.length) {
    i = skipWs(s, i);
    if (i >= s.length) return { value: out, next: s.length, partial: true };
    if (s[i] !== '"') {
      // Malformed key — bail.
      return { value: out, next: s.length, partial: true };
    }
    const keyRes = readValue(s, i);
    const key = String(keyRes.value ?? "");
    if (keyRes.partial) return { value: out, next: s.length, partial: true };
    i = skipWs(s, keyRes.next);
    if (i >= s.length || s[i] !== ":") {
      return { value: out, next: s.length, partial: true };
    }
    i = skipWs(s, i + 1);
    const valRes = readValue(s, i);
    if (valRes.partial) {
      if (typeof valRes.value === "string" && valRes.value.length > 0) {
        out[key] = valRes.value;
      }
      return { value: out, next: s.length, partial: true };
    }
    out[key] = valRes.value;
    i = skipWs(s, valRes.next);
    if (i < s.length && s[i] === ",") {
      i++;
      continue;
    }
    if (i < s.length && s[i] === "}") return { value: out, next: i + 1 };
    if (i >= s.length) return { value: out, next: s.length, partial: true };
    return { value: out, next: s.length, partial: true };
  }
  return { value: out, next: s.length, partial: true };
}

/**
 * Locate the (top-level) array value for a given key in a partial JSON object.
 * Returns the parsed array (typed) of completed elements, or [] if not found.
 */
function findArrayForKey<T>(raw: string, key: string): T[] {
  const s = stripCodeFences(raw);
  // Find `"key"` occurrences, then look for the following `:`.
  const needle = `"${key}"`;
  let from = 0;
  while (true) {
    const idx = s.indexOf(needle, from);
    if (idx === -1) return [];
    let j = idx + needle.length;
    j = skipWs(s, j);
    if (j < s.length && s[j] === ":") {
      const res = readValue(s, skipWs(s, j + 1));
      if (Array.isArray(res.value)) {
        return res.value as T[];
      }
    }
    from = idx + 1;
  }
}

/** Extract a top-level string field (e.g. `topic`) from a partial JSON object. */
function findStringField(raw: string, key: string): string {
  const s = stripCodeFences(raw);
  const needle = `"${key}"`;
  let from = 0;
  while (true) {
    const idx = s.indexOf(needle, from);
    if (idx === -1) return "";
    let j = idx + needle.length;
    j = skipWs(s, j);
    if (j < s.length && s[j] === ":") {
      const res = readValue(s, skipWs(s, j + 1));
      if (typeof res.value === "string") return res.value;
    }
    from = idx + 1;
  }
}

/** Pull a string array out of a partial JSON stream (e.g. tag generator). */
export function extractStringArray(raw: string, key = "tags"): string[] {
  const list = findArrayForKey<string>(raw, key);
  // Dedupe case-insensitively, drop empties, trim.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const v = String(item ?? "").trim();
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

export type HashtagItem = {
  tag: string;
  category?: string;
  searchVolume?: string;
  competition?: string;
  relevanceScore?: number;
  reason?: string;
};

/** Pull an object array out of a partial JSON stream (e.g. hashtag generator). */
export function extractObjectArray<T = HashtagItem>(
  raw: string,
  key = "recommended"
): T[] {
  const list = findArrayForKey<Record<string, unknown>>(raw, key);
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const tag = String(item.tag ?? "").replace(/[^a-zA-Z0-9]/g, "");
    if (!tag) continue;
    if (seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    out.push({
      tag,
      category: item.category ? String(item.category) : undefined,
      searchVolume: item.searchVolume ? String(item.searchVolume) : undefined,
      competition: item.competition ? String(item.competition) : undefined,
      relevanceScore:
        item.relevanceScore != null && !isNaN(Number(item.relevanceScore))
          ? Math.max(0, Math.min(100, Number(item.relevanceScore)))
          : undefined,
      reason: item.reason ? String(item.reason) : undefined,
    } as unknown as T);
  }
  return out;
}

export { findStringField as extractStringField };
