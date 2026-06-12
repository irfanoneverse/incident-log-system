<script setup lang="ts">
import type { CreateIncidentInput } from '~/types'

useHead({ title: 'New Incident' })

const { createIncident } = useIncidents()
const loading = ref(false)
const error = ref('')

async function handleSubmit(data: CreateIncidentInput) {
  loading.value = true
  error.value = ''
  try {
    const incident = await createIncident(data)
    await navigateTo(`/incidents/${incident.id}`)
  } catch {
    error.value = 'Failed to create incident. Please try again.'
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/incidents" class="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
        ← Back to incidents
      </NuxtLink>
      <h1 class="mt-4 text-base font-semibold text-white">New incident</h1>
      <p class="mt-1 text-sm text-zinc-400">Fill in the details below to log a new incident.</p>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div v-if="error" class="mb-5 flex items-center gap-2 rounded-lg bg-red-950/50 border border-red-900/50 px-3 py-2.5">
        <span class="text-xs text-red-400">{{ error }}</span>
      </div>
      <IncidentForm mode="create" :loading="loading" @submit="handleSubmit" @cancel="navigateTo('/incidents')" />
    </div>
  </div>
</template>
