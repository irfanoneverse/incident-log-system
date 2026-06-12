/**
 * POST /api/auth/login
 *
 * Validates username/password against environment variables.
 * Sets a session cookie on success.
 */
import { LoginSchema } from '../../validations/incident'
import { setAuthSession, createValidationError, createUnauthorizedError } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = LoginSchema.safeParse(body)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  const { username, password } = result.data
  const config = useRuntimeConfig(event)

  // Compare against env vars
  if (username !== config.adminUsername || password !== config.adminPassword) {
    throw createUnauthorizedError('Invalid credentials')
  }

  setAuthSession(event)

  return { ok: true, message: 'Logged in' }
})
