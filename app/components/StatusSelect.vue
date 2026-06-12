<script setup lang="ts">
import type { IncidentStatus } from '~/types'

const props = defineProps<{ value: IncidentStatus; disabled?: boolean }>()
const emit = defineEmits<{ change: [status: IncidentStatus] }>()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownPos = ref({ top: 0, left: 0 })

const options: { value: IncidentStatus; label: string; dot: string }[] = [
  { value: 'IN_PROGRESS',  label: 'In Progress',  dot: 'bg-amber-500' },
  { value: 'RESOLVED',     label: 'Resolved',     dot: 'bg-emerald-500' },
  { value: 'IRRESOLVABLE', label: 'Irresolvable', dot: 'bg-red-500' },
]

const pillCls: Record<IncidentStatus, string> = {
  IN_PROGRESS:  'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/30',
  RESOLVED:     'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30',
  IRRESOLVABLE: 'bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/20 dark:text-red-300 dark:ring-red-500/30',
}

function toggle() {
  if (props.disabled) return
  if (!open.value) {
    const rect = triggerRef.value?.getBoundingClientRect()
    if (rect) {
      dropdownPos.value = { top: rect.bottom + 6, left: rect.left }
    }
  }
  open.value = !open.value
}

function select(status: IncidentStatus) {
  open.value = false
  if (status !== props.value) emit('change', status)
}

function onOutsideClick(e: MouseEvent) {
  if (!triggerRef.value?.contains(e.target as Node)) open.value = false
}

// Close on scroll so the pill and panel don't get out of sync
function onScroll() { open.value = false }

onMounted(() => {
  document.addEventListener('click', onOutsideClick)
  document.addEventListener('scroll', onScroll, true)
})
onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('scroll', onScroll, true)
})
</script>

<template>
  <div ref="triggerRef" class="inline-block">
    <!-- Trigger pill -->
    <button
      type="button"
      :disabled="disabled"
      class="inline-flex items-center justify-between min-w-[7.5rem] pl-2.5 pr-2 py-0.5 rounded-full text-xs font-medium ring-1 transition-opacity"
      :class="[pillCls[value], disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80']"
      @click.stop="toggle"
    >
      {{ options.find(o => o.value === value)?.label }}
      <svg
        class="w-2.5 h-2.5 opacity-60 transition-transform duration-150"
        :class="open ? 'rotate-180' : ''"
        viewBox="0 0 10 6" fill="none"
      >
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>

  <!-- Teleport to body so overflow:hidden on table doesn't clip it -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="fixed z-50 w-40 origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg shadow-black/8 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black/40"
        :style="{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }"
        @click.stop
      >
        <div class="p-1">
          <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            class="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
            :class="opt.value === value
              ? 'bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-white'"
            @click.stop="select(opt.value)"
          >
            <span class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full flex-shrink-0" :class="opt.dot" />
              {{ opt.label }}
            </span>
            <svg v-if="opt.value === value" class="w-3 h-3 opacity-50 flex-shrink-0" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
