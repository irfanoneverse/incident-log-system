/** Format ISO date string to "Jun 12, 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Format ISO date string to "Jun 12, 2026, 10:30 AM" */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
