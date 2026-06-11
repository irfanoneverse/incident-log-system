/**
 * POST /api/auth/logout
 *
 * Clears the session cookie.
 */
import { clearAuthSession } from '~/server/utils/helpers'

export default defineEventHandler((event) => {
  clearAuthSession(event)
  return { ok: true, message: 'Logged out' }
})
