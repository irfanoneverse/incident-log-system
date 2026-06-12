<script setup lang="ts">
import type { IncidentStatus } from '~/types'

defineProps<{ status: IncidentStatus }>()

const config: Record<IncidentStatus, { label: string; cls: string }> = {
  OPEN:        { label: 'Open',        cls: 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30' },
  IN_PROGRESS: { label: 'In Progress', cls: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30' },
  RESOLVED:    { label: 'Resolved',    cls: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30' },
  CLOSED:      { label: 'Closed',      cls: 'bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-600/40' },
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
