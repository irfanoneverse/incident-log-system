/**
 * Shared types used across the frontend (pages, components, composables).
 * These mirror Prisma model types but are safe to import in both server and client code.
 */

// ─────────────────────────────────────────────────────────────
// Enums (string unions — do not use Prisma enum directly on client)
// ─────────────────────────────────────────────────────────────

export type IncidentCategory =
  | 'HARDWARE'
  | 'SOFTWARE'
  | 'NETWORK'
  | 'ACCESS'
  | 'EMAIL'
  | 'PRINTER'
  | 'PHONE'
  | 'OTHER'

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

// ─────────────────────────────────────────────────────────────
// Incident
// ─────────────────────────────────────────────────────────────

/** Full incident record (as returned by GET /api/incidents/:id) */
export interface Incident {
  id: string
  title: string
  description: string
  reporterName: string
  category: IncidentCategory
  priority: IncidentPriority
  status: IncidentStatus
  resolutionNotes: string | null
  createdAt: string // ISO string from API
  updatedAt: string
  resolvedAt: string | null
}

/** Lightweight incident row (as returned in GET /api/incidents list) */
export type IncidentRow = Omit<Incident, 'description' | 'resolutionNotes'>

// ─────────────────────────────────────────────────────────────
// API Response wrappers
// ─────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: {
    issues?: { field: string; message: string }[]
  }
}

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalThisWeek: number
  totalThisMonth: number
  categoryBreakdown: { category: IncidentCategory; count: number }[]
  statusBreakdown: { status: IncidentStatus; count: number }[]
  avgResolutionHours: number | null
}

// ─────────────────────────────────────────────────────────────
// Display helpers (for labels and colors in the UI)
// ─────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  NETWORK: 'Network',
  ACCESS: 'Access',
  EMAIL: 'Email',
  PRINTER: 'Printer',
  PHONE: 'Phone',
  OTHER: 'Other',
}

export const PRIORITY_LABELS: Record<IncidentPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}
