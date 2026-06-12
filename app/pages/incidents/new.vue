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
  } catch (e: unknown) {
    const fe = e as { data?: { message?: string; statusMessage?: string }; statusMessage?: string }
    error.value = fe?.data?.message ?? fe?.statusMessage ?? 'Failed to create incident. Please try again.'
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/incidents" class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300">
        ← Back to incidents
      </NuxtLink>
      <h1 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">New incident</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">Fill in the details below to log a new incident.</p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div v-if="error" class="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 dark:bg-red-950/50 dark:border-red-900/50">
        <span class="text-xs text-red-600 dark:text-red-400">{{ error }}</span>
      </div>
      <IncidentForm mode="create" :loading="loading" @submit="handleSubmit" @cancel="navigateTo('/incidents')" />
    </div>
  </div>
</template>
