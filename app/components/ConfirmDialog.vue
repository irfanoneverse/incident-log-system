<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60"
        @click.self="emit('cancel')"
      >
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
            <p class="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">{{ message }}</p>

            <div class="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                class="h-8 px-3.5 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-zinc-400 dark:hover:text-white"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="loading"
                class="h-8 px-3.5 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                @click="emit('confirm')"
              >
                {{ loading ? 'Deleting…' : (confirmLabel ?? 'Delete') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
