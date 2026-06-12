<script setup lang="ts">
import type { UpdateIncidentInput } from '~/types'
import { CATEGORY_LABELS } from '~/types'

const route = useRoute()
const id = route.params.id as string
const { fetchIncident, updateIncident, deleteIncident } = useIncidents()

const { data: incident, refresh } = await useAsyncData(
  `incident-${id}`,
  () => fetchIncident(id),
)

if (!incident.value) {
  throw createError({ statusCode: 404, statusMessage: 'Incident not found' })
}

useHead(() => ({ title: incident.value?.title ?? 'Incident' }))

const editing  = ref(false)
const saving   = ref(false)
const deleting = ref(false)
const saveError = ref('')

async function handleUpdate(data: UpdateIncidentInput) {
  saving.value = true
  saveError.value = ''
  try {
    await updateIncident(id, data)
    await refresh()
    editing.value = false
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Delete this incident? This action cannot be undone.')) return
  deleting.value = true
  try {
    await deleteIncident(id)
    await navigateTo('/incidents')
  } catch {
    deleting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">

    <NuxtLink to="/incidents" class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300">
      ← Back to incidents
    </NuxtLink>

    <template v-if="incident">

      <!-- View mode -->
      <template v-if="!editing">

        <div class="mt-5 flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge :status="incident.status" />
              <PriorityBadge :priority="incident.priority" />
              <span class="text-xs text-gray-500 dark:text-zinc-500">{{ CATEGORY_LABELS[incident.category] }}</span>
            </div>
            <h1 class="text-lg font-semibold text-gray-900 leading-snug dark:text-white">{{ incident.title }}</h1>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0 pt-0.5">
            <button
              class="h-8 px-3 text-[13px] font-medium border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
              @click="editing = true"
            >
              Edit
            </button>
            <button
              :disabled="deleting"
              class="h-8 px-3 text-[13px] font-medium border border-gray-300 text-red-500 rounded-lg hover:border-red-300 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-zinc-700 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/40"
              @click="handleDelete"
            >
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>

        <!-- Metadata grid -->
        <div class="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 dark:text-zinc-500">Reporter</p>
            <p class="text-gray-800 font-medium dark:text-zinc-200">{{ incident.reporterName }}</p>
          </div>
          <div>
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 dark:text-zinc-500">Created</p>
            <p class="text-gray-800 tabular-nums dark:text-zinc-200">{{ formatDateTime(incident.createdAt) }}</p>
          </div>
          <div>
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 dark:text-zinc-500">Last updated</p>
            <p class="text-gray-800 tabular-nums dark:text-zinc-200">{{ formatDateTime(incident.updatedAt) }}</p>
          </div>
          <div v-if="incident.resolvedAt">
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 dark:text-zinc-500">Resolved at</p>
            <p class="text-gray-800 tabular-nums dark:text-zinc-200">{{ formatDateTime(incident.resolvedAt) }}</p>
          </div>
        </div>

        <!-- Description -->
        <div class="mt-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-3 dark:text-zinc-500">Description</p>
          <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed dark:text-zinc-300">{{ incident.description }}</p>
        </div>

        <!-- Resolution notes -->
        <div v-if="incident.resolutionNotes" class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20" :class="incident.status === 'IRRESOLVABLE' ? 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20' : ''">
          <p class="text-[11px] font-medium uppercase tracking-wider mb-3" :class="incident.status === 'IRRESOLVABLE' ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'">{{ incident.status === 'IRRESOLVABLE' ? 'Notes' : 'Resolution notes' }}</p>
          <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed dark:text-zinc-300">{{ incident.resolutionNotes }}</p>
        </div>

      </template>

      <!-- Edit mode -->
      <template v-else>
        <div class="mt-5">
          <h1 class="text-base font-semibold text-gray-900 mb-1 dark:text-white">Edit incident</h1>
          <p class="text-sm text-gray-500 mb-5 dark:text-zinc-400">Update the incident details below.</p>
          <div v-if="saveError" class="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 dark:bg-red-950/50 dark:border-red-900/50">
            <span class="text-xs text-red-600 dark:text-red-400">{{ saveError }}</span>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <IncidentForm
              mode="edit"
              :initial-data="incident"
              :loading="saving"
              @submit="handleUpdate"
              @cancel="editing = false; saveError = ''"
            />
          </div>
        </div>
      </template>

    </template>
  </div>
</template>
