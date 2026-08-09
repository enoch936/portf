import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

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
  // Create a local SQLite file under prisma/dev.db and use it as fallback.
  const prismaDir = path.join(process.cwd(), 'prisma')
  try {
    if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true })
    const devDbPath = path.join(prismaDir, 'dev.db')
    if (!fs.existsSync(devDbPath)) fs.writeFileSync(devDbPath, '')
    const resolved = path.resolve(devDbPath).replace(/\\/g, '/')
    databaseUrl = `file:${resolved}`
    console.info(`No DATABASE_URL set — created/using local SQLite at ${devDbPath}`)
  } catch (err) {
    console.error('Failed to create local SQLite dev.db:', err)
  }
}

prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
