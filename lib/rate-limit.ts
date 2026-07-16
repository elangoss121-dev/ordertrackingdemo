const rateLimit = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

export function rateLimiter(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimit.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: MAX_REQUESTS - record.count };
}

export function authRateLimiter(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const key = `auth:${identifier}`;
  const record = rateLimit.get(key);
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000;

  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: maxAttempts - record.count };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
  }, 60 * 1000);
}
