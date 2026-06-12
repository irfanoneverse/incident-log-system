/**
 * DELETE /api/incidents/:id
 *
 * Permanently delete an incident.
 */
import { prisma } from '../../lib/prisma'
import { createNotFoundError } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Check exists first to give a proper 404 instead of Prisma error
  const existing = await prisma.incident.findUnique({ where: { id } })
  if (!existing) {
    throw createNotFoundError('Incident')
  }

  await prisma.incident.delete({ where: { id } })

  setResponseStatus(event, 204)
  return null
})
