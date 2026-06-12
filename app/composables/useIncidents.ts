import type {
  Incident,
  IncidentRow,
  PaginatedResponse,
  CreateIncidentInput,
  UpdateIncidentInput,
} from '~/types'

export interface IncidentListFilters {
  page?: number
  search?: string
  status?: string
  category?: string
  priority?: string
  sortBy?: string
  sortOrder?: string
}

/** CRUD operations for incidents. All methods return raw fetch promises. */
export function useIncidents() {
  function fetchIncidents(filters: IncidentListFilters = {}) {
    const query = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    )
    return $fetch<PaginatedResponse<IncidentRow>>('/api/incidents', { query })
  }

  function fetchIncident(id: string) {
    return $fetch<Incident>(`/api/incidents/${id}`)
  }

  function createIncident(data: CreateIncidentInput) {
    return $fetch<Incident>('/api/incidents', { method: 'POST', body: data })
  }

  function updateIncident(id: string, data: UpdateIncidentInput) {
    return $fetch<Incident>(`/api/incidents/${id}`, { method: 'PATCH', body: data })
  }

  function deleteIncident(id: string) {
    return $fetch(`/api/incidents/${id}`, { method: 'DELETE' })
  }

  return { fetchIncidents, fetchIncident, createIncident, updateIncident, deleteIncident }
}
