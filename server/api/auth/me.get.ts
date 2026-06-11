/**
 * GET /api/auth/me
 *
 * Returns auth status. Used by the frontend to check if the session is valid.
 */
import { isAuthenticated } from '~/server/utils/helpers'

export default defineEventHandler((event) => {
  const authenticated = isAuthenticated(event)
  return { authenticated }
})
