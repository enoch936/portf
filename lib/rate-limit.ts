type RateLimitRecord = {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

export function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 }
  }

  record.count += 1
  return { success: true, remaining: limit - record.count }
}
