/**
 * GET /api/dashboard/stats
 *
 * Returns all data needed by the dashboard in a single request:
 * - Total incidents this week
 * - Total incidents this month
 * - Category breakdown
 * - Status breakdown
 * - Average resolution time (in hours)
 */
import { prisma } from '~/server/lib/prisma'

export default defineEventHandler(async () => {
  const now = new Date()

  // Week: Monday of current week at 00:00
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  startOfWeek.setHours(0, 0, 0, 0)

  // Month: 1st of current month at 00:00
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalThisWeek,
    totalThisMonth,
    categoryBreakdown,
    statusBreakdown,
    resolvedIncidents,
  ] = await Promise.all([
    // Total this week
    prisma.incident.count({
      where: { createdAt: { gte: startOfWeek } },
    }),

    // Total this month
    prisma.incident.count({
      where: { createdAt: { gte: startOfMonth } },
    }),

    // Category breakdown
    prisma.incident.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } },
    }),

    // Status breakdown
    prisma.incident.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),

    // For avg resolution time — only incidents with both createdAt and resolvedAt
    prisma.incident.findMany({
      where: { resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
  ])

  // Calculate avg resolution time in hours
  let avgResolutionHours: number | null = null
  if (resolvedIncidents.length > 0) {
    const totalMs = resolvedIncidents.reduce((sum, inc) => {
      return sum + (inc.resolvedAt!.getTime() - inc.createdAt.getTime())
    }, 0)
    avgResolutionHours = Math.round(totalMs / resolvedIncidents.length / 1000 / 60 / 60 * 10) / 10
  }

  return {
    totalThisWeek,
    totalThisMonth,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category,
      count: c._count._all,
    })),
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s._count._all,
    })),
    avgResolutionHours,
  }
})
