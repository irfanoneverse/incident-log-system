/**
 * Prisma client singleton for use across all server routes.
 *
 * Prevents multiple PrismaClient instances during hot-reload in development.
 * Import this instead of instantiating PrismaClient directly.
 */
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
