<script setup lang="ts">
import type { PaginationMeta } from '~/types'

defineProps<{ pagination: PaginationMeta }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-zinc-800">
    <p class="text-xs text-gray-500 dark:text-zinc-500">
      {{ pagination.total }} incident{{ pagination.total !== 1 ? 's' : '' }}
    </p>
    <div class="flex items-center gap-2">
      <button
        :disabled="!pagination.hasPrevPage"
        class="h-7 px-3 text-xs rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-600"
        @click="emit('change', pagination.page - 1)"
      >
        Previous
      </button>
      <span class="text-xs text-gray-500 tabular-nums dark:text-zinc-500">{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button
        :disabled="!pagination.hasNextPage"
        class="h-7 px-3 text-xs rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-600"
        @click="emit('change', pagination.page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
