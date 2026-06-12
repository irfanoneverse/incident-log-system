<script setup lang="ts">
const error = useError()

const title = computed(() => {
  if (error.value?.statusCode === 404) return 'Page not found'
  if (error.value?.statusCode === 401) return 'Unauthorized'
  return 'Something went wrong'
})

const message = computed(() => error.value?.statusMessage ?? 'An unexpected error occurred.')
</script>

<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
    <div class="text-center space-y-4">
      <p class="text-5xl font-bold text-zinc-700 tabular-nums">{{ error?.statusCode ?? '?' }}</p>
      <p class="text-base font-semibold text-white">{{ title }}</p>
      <p class="text-sm text-zinc-400 max-w-xs">{{ message }}</p>
      <button
        class="mt-2 inline-flex h-8 px-4 items-center rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        @click="clearError({ redirect: '/incidents' })"
      >
        Go to incidents
      </button>
    </div>
  </div>
</template>
