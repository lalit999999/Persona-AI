/**
 * Detects rate-limit / quota-exhausted errors across LLM providers so callers
 * can fall back to an in-character message instead of surfacing a raw API error.
 */
export function isRateLimitOrQuotaError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  const nested = (e.error && typeof e.error === "object" ? e.error : {}) as Record<
    string,
    unknown
  >;

  const status = e.status;
  if (status === 429 || status === 402 || status === "RESOURCE_EXHAUSTED") return true;

  const code = e.code ?? nested.code;
  if (code === "insufficient_quota" || code === "rate_limit_exceeded") return true;

  const type = e.type ?? nested.type;
  if (
    type === "rate_limit_exceeded" ||
    type === "rate_limit_error" ||
    type === "overloaded_error" ||
    type === "insufficient_quota"
  ) {
    return true;
  }

  return false;
}
