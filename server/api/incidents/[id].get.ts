/**
 * GET /api/incidents/:id
 *
 * Fetch a single incident by ID.
 */
import { prisma } from '../../lib/prisma'
import { createNotFoundError } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const incident = await prisma.incident.findUnique({
    where: { id },
  })

  if (!incident) {
    throw createNotFoundError('Incident')
  }

  return incident
})
