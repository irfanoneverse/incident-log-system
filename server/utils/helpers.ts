/**
 * Shared server-side utilities.
 * Used by API route handlers to send consistent responses and handle errors.
 */
import type { H3Event } from 'h3'
import { ZodError } from 'zod'

// ─────────────────────────────────────────────────────────────
// Error response helpers
// ─────────────────────────────────────────────────────────────

export function createValidationError(error: ZodError) {
  const issues = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }))

  return createError({
    statusCode: 422,
    statusMessage: 'Validation Error',
    data: { issues },
  })
}

export function createNotFoundError(resource: string) {
  return createError({
    statusCode: 404,
    statusMessage: `${resource} not found`,
  })
}

export function createUnauthorizedError(message = 'Unauthorized') {
  return createError({
    statusCode: 401,
    statusMessage: message,
  })
}

// ─────────────────────────────────────────────────────────────
// Session / Auth helpers
// ─────────────────────────────────────────────────────────────

const SESSION_COOKIE = 'incident_session'

export function setAuthSession(event: H3Event) {
  setCookie(event, SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
}

export function clearAuthSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE)
}

export function isAuthenticated(event: H3Event): boolean {
  const cookie = getCookie(event, SESSION_COOKIE)
  return cookie === 'authenticated'
}

// ─────────────────────────────────────────────────────────────
// Pagination helper
// ─────────────────────────────────────────────────────────────

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
