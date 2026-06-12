/**
 * PATCH /api/incidents/:id
 *
 * Update an incident (full or partial).
 * Automatically sets resolvedAt when status changes to RESOLVED.
 * Clears resolvedAt when status moves back to OPEN or IN_PROGRESS.
 */
import { prisma } from '../../lib/prisma'
import { UpdateIncidentSchema } from '../../validations/incident'
import { createValidationError, createNotFoundError } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const result = UpdateIncidentSchema.safeParse(body)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  // Check incident exists
  const existing = await prisma.incident.findUnique({ where: { id } })
  if (!existing) {
    throw createNotFoundError('Incident')
  }

  const updateData = result.data

  // Auto-manage resolvedAt based on terminal vs active status
  if (updateData.status === 'RESOLVED' || updateData.status === 'IRRESOLVABLE') {
    if (!existing.resolvedAt) {
      ;(updateData as Record<string, unknown>).resolvedAt = new Date()
    }
  } else if (updateData.status === 'IN_PROGRESS') {
    ;(updateData as Record<string, unknown>).resolvedAt = null
  }

  const incident = await prisma.incident.update({
    where: { id },
    data: updateData,
  })

  return incident
})
