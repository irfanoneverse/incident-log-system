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

    <NuxtLink to="/incidents" class="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
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
              <span class="text-xs text-zinc-500">{{ CATEGORY_LABELS[incident.category] }}</span>
            </div>
            <h1 class="text-lg font-semibold text-white leading-snug">{{ incident.title }}</h1>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0 pt-0.5">
            <button
              class="h-8 px-3 text-[13px] font-medium border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
              @click="editing = true"
            >
              Edit
            </button>
            <button
              :disabled="deleting"
              class="h-8 px-3 text-[13px] font-medium border border-zinc-700 text-red-400 rounded-lg hover:border-red-800 hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              @click="handleDelete"
            >
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>

        <!-- Metadata grid -->
        <div class="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm">
          <div>
            <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Reporter</p>
            <p class="text-zinc-200 font-medium">{{ incident.reporterName }}</p>
          </div>
          <div>
            <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Created</p>
            <p class="text-zinc-200 tabular-nums">{{ formatDateTime(incident.createdAt) }}</p>
          </div>
          <div>
            <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Last updated</p>
            <p class="text-zinc-200 tabular-nums">{{ formatDateTime(incident.updatedAt) }}</p>
          </div>
          <div v-if="incident.resolvedAt">
            <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Resolved at</p>
            <p class="text-zinc-200 tabular-nums">{{ formatDateTime(incident.resolvedAt) }}</p>
          </div>
        </div>

        <!-- Description -->
        <div class="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3">Description</p>
          <p class="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{{ incident.description }}</p>
        </div>

        <!-- Resolution notes -->
        <div v-if="incident.resolutionNotes" class="mt-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-5">
          <p class="text-[11px] font-medium text-emerald-500 uppercase tracking-wider mb-3">Resolution notes</p>
          <p class="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{{ incident.resolutionNotes }}</p>
        </div>

      </template>

      <!-- Edit mode -->
      <template v-else>
        <div class="mt-5">
          <h1 class="text-base font-semibold text-white mb-1">Edit incident</h1>
          <p class="text-sm text-zinc-400 mb-5">Update the incident details below.</p>
          <div v-if="saveError" class="mb-5 flex items-center gap-2 rounded-lg bg-red-950/50 border border-red-900/50 px-3 py-2.5">
            <span class="text-xs text-red-400">{{ saveError }}</span>
          </div>
          <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
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
