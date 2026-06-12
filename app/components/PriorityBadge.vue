<script setup lang="ts">
import type { IncidentPriority } from '~/types'

defineProps<{ priority: IncidentPriority }>()

const config: Record<IncidentPriority, { label: string; dot: string; text: string }> = {
  LOW:      { label: 'Low',      dot: 'bg-gray-400 dark:bg-zinc-500',   text: 'text-gray-500 dark:text-zinc-400' },
  MEDIUM:   { label: 'Medium',   dot: 'bg-sky-500 dark:bg-sky-400',     text: 'text-sky-600 dark:text-sky-300' },
  CRITICAL: { label: 'Critical', dot: 'bg-red-500',                     text: 'text-red-600 dark:text-red-300' },
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-xs font-medium" :class="config[priority].text">
    <span class="h-1.5 w-1.5 rounded-full flex-shrink-0" :class="config[priority].dot" />
    {{ config[priority].label }}
  </span>
</template>
