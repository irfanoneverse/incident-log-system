<script setup lang="ts">
import type { PaginationMeta } from '~/types'

defineProps<{ pagination: PaginationMeta }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
    <p class="text-xs text-zinc-500">
      {{ pagination.total }} incident{{ pagination.total !== 1 ? 's' : '' }}
    </p>
    <div class="flex items-center gap-2">
      <button
        :disabled="!pagination.hasPrevPage"
        class="h-7 px-3 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="emit('change', pagination.page - 1)"
      >
        Previous
      </button>
      <span class="text-xs text-zinc-500 tabular-nums">{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button
        :disabled="!pagination.hasNextPage"
        class="h-7 px-3 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="emit('change', pagination.page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
