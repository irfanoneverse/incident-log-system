/**
 * Auth middleware — protects all /api/* routes except /api/auth/*.
 * Reads the session cookie and returns 401 if not authenticated.
 */
import { isAuthenticated, createUnauthorizedError } from '~/server/utils/helpers'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Only protect /api/* routes
  if (!url.pathname.startsWith('/api/')) return

  // Skip auth routes
  if (url.pathname.startsWith('/api/auth/')) return

  if (!isAuthenticated(event)) {
    throw createUnauthorizedError()
  }
})
