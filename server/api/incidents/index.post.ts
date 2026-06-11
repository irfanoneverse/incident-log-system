/**
 * POST /api/incidents
 *
 * Create a new incident.
 *
 * Body: CreateIncidentInput
 */
import { prisma } from '~/server/lib/prisma'
import { CreateIncidentSchema } from '~/server/validations/incident'
import { createValidationError } from '~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = CreateIncidentSchema.safeParse(body)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  const incident = await prisma.incident.create({
    data: result.data,
  })

  setResponseStatus(event, 201)
  return incident
})
