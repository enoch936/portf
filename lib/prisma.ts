import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

function getFallback(method: string) {
  if (method === 'findUnique' || method === 'findFirst') return null
  if (method === 'count') return 0
  return []
}

function makeFallbackModel() {
  return new Proxy(
    {},
    {
      get(_t, method: string) {
        return (..._args: unknown[]) => Promise.resolve(getFallback(method))
      },
    }
  )
}

let prisma: PrismaClient

if (!databaseUrl) {
  console.warn('DATABASE_URL not set — using fallback prisma stub (no DB).')
  const fallback = new Proxy(
    {},
    {
      get(_t, prop: string) {
        if (prop === '$connect' || prop === '$disconnect' || prop === '$on' || prop === '$use' || prop === '$transaction') {
          return async () => undefined
        }
        return makeFallbackModel()
      },
    }
  )

  prisma = fallback as unknown as PrismaClient
} else {
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      datasources: { db: { url: databaseUrl } },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }
