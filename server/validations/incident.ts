import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// Shared enum schemas (mirror Prisma enums)
// ─────────────────────────────────────────────────────────────

export const IncidentCategorySchema = z.enum([
  'HARDWARE',
  'SOFTWARE',
  'NETWORK',
  'OTHERS',
])

export const IncidentPrioritySchema = z.enum(['LOW', 'MEDIUM', 'CRITICAL'])

export const IncidentStatusSchema = z.enum(['IN_PROGRESS', 'RESOLVED', 'IRRESOLVABLE'])

// ─────────────────────────────────────────────────────────────
// Create Incident
// ─────────────────────────────────────────────────────────────

export const CreateIncidentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  reporterName: z.string().min(2, 'Reporter name is required').max(100),
  category: IncidentCategorySchema,
  priority: IncidentPrioritySchema,
})

export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>

// ─────────────────────────────────────────────────────────────
// Update Incident (all fields optional)
// ─────────────────────────────────────────────────────────────

export const UpdateIncidentSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).max(5000).optional(),
  reporterName: z.string().min(2).max(100).optional(),
  category: IncidentCategorySchema.optional(),
  priority: IncidentPrioritySchema.optional(),
  status: IncidentStatusSchema.optional(),
  resolutionNotes: z.string().max(5000).nullable().optional(),
})

export type UpdateIncidentInput = z.infer<typeof UpdateIncidentSchema>

// ─────────────────────────────────────────────────────────────
// Update Status only (for inline status changes from the list)
// ─────────────────────────────────────────────────────────────

export const UpdateStatusSchema = z.object({
  status: IncidentStatusSchema,
  resolutionNotes: z.string().max(5000).nullable().optional(),
})

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>

// ─────────────────────────────────────────────────────────────
// List / Search query params
// ─────────────────────────────────────────────────────────────

export const ListIncidentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  status: IncidentStatusSchema.optional(),
  category: IncidentCategorySchema.optional(),
  priority: IncidentPrioritySchema.optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'priority', 'status', 'title'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ListIncidentsQuery = z.infer<typeof ListIncidentsQuerySchema>

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>
