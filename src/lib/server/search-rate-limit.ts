interface RateBucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MAX_TRACKED_KEYS = 2000;

const globalBuckets = globalThis as unknown as {
  pasarkuSearchRateBuckets?: Map<string, RateBucket>;
};

function getBucketMap(): Map<string, RateBucket> {
  if (!globalBuckets.pasarkuSearchRateBuckets) {
    globalBuckets.pasarkuSearchRateBuckets = new Map<string, RateBucket>();
  }
  return globalBuckets.pasarkuSearchRateBuckets;
}

export function extractClientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim().slice(0, 64);
  return 'local-client';
}

export function consumeSearchRateLimit(clientKey: string, now = Date.now()): {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const buckets = getBucketMap();
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, b] of buckets.entries()) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const current = buckets.get(clientKey);
  if (!current || current.resetAt <= now) {
    buckets.set(clientKey, { count: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      retryAfterSec: 60,
    };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - current.count,
    retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

