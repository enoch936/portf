import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  'postgresql://localhost:5432/portf'

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient

function getFallback(method: string) {
  if (method === 'findUnique' || method === 'findFirst') return null
  if (method === 'count') return 0
  return []
}

function wrapModel(model: Record<string, unknown>) {
  return new Proxy(model, {
    get(target, method: string) {
      const prop = (target as Record<string, unknown>)[method]
      if (typeof prop !== 'function') return prop
      return (...args: unknown[]) => {
        try {
          const result = (prop as Function).apply(target, args)
          if (result && typeof (result as any).then === 'function') {
            return (result as any).then(null, (e: Error) => {
              console.error('Prisma query error:', e?.message || e)
              return getFallback(method)
            })
          }
          return result
        } catch (e: unknown) {
          console.error('Prisma query error:', e instanceof Error ? e.message : e)
          return getFallback(method)
        }
      }
    },
  })
}

const safePrisma = new Proxy(prismaClient, {
  get(target, prop: string) {
    const t = target as unknown as Record<string, unknown>
    if (['$connect', '$disconnect', '$on', '$use', '$transaction', '$extends'].includes(prop)) {
      return t[prop]
    }
    const model = t[prop]
    if (model && typeof model === 'object') {
      return wrapModel(model as Record<string, unknown>)
    }
    return model
  },
})

export const prisma = safePrisma as PrismaClient
