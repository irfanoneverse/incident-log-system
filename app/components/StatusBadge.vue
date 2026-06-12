<script setup lang="ts">
import type { IncidentStatus } from '~/types'

defineProps<{ status: IncidentStatus }>()

const config: Record<IncidentStatus, { label: string; cls: string }> = {
  IN_PROGRESS:  { label: 'In Progress', cls: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/30' },
  RESOLVED:     { label: 'Resolved',    cls: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30' },
  IRRESOLVABLE: { label: 'Irresolvable', cls: 'bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-500/20 dark:text-red-300 dark:ring-red-500/30' },
}
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
    :class="config[status].cls"
  >
    {{ config[status].label }}
  </span>
</template>
