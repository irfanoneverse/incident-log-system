/**
 * GET /api/incidents
 *
 * List incidents with pagination, search, filtering, and sorting.
 *
 * Query params:
 *   page       - Page number (default: 1)
 *   limit      - Items per page (default: 20, max: 100)
 *   search     - Full-text search on title and description
 *   status     - Filter by status (OPEN | IN_PROGRESS | RESOLVED | CLOSED)
 *   category   - Filter by category
 *   priority   - Filter by priority
 *   sortBy     - Sort field (createdAt | updatedAt | priority | status | title)
 *   sortOrder  - Sort direction (asc | desc)
 */
import { prisma } from '../../lib/prisma'
import { ListIncidentsQuerySchema } from '../../validations/incident'
import { createValidationError, buildPaginationMeta } from '../../utils/helpers'
import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const result = ListIncidentsQuerySchema.safeParse(query)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  const { page, limit, search, status, category, priority, sortBy, sortOrder } = result.data
  const skip = (page - 1) * limit

  // Build where clause
  const where: Prisma.IncidentWhereInput = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { reporterName: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) where.status = status
  if (category) where.category = category
  if (priority) where.priority = priority

  // Execute count + data in parallel
  const [total, incidents] = await Promise.all([
    prisma.incident.count({ where }),
    prisma.incident.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        reporterName: true,
        category: true,
        priority: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        resolvedAt: true,
      },
    }),
  ])

  return {
    data: incidents,
    pagination: buildPaginationMeta(page, limit, total),
  }
})
