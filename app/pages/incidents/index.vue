<script setup lang="ts">
import type { IncidentRow, IncidentStatus, PaginatedResponse } from '~/types'
import { CATEGORY_LABELS } from '~/types'

useHead({ title: 'Incidents' })

const { fetchIncidents, updateIncident } = useIncidents()
const route = useRoute()
const router = useRouter()

const searchInput = ref((route.query.search as string) ?? '')
let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => setFilter('search', value || undefined), 350)
})
onUnmounted(() => clearTimeout(debounceTimer))

const filters = computed(() => ({
  page:      Number(route.query.page) || 1,
  search:    (route.query.search as string) || undefined,
  status:    (route.query.status as string) || undefined,
  category:  (route.query.category as string) || undefined,
  priority:  (route.query.priority as string) || undefined,
  sortBy:    (route.query.sortBy as string) || 'createdAt',
  sortOrder: (route.query.sortOrder as string) || 'desc',
}))

function setFilter(key: string, value: string | number | undefined) {
  router.push({
    query: { ...route.query, [key]: value, ...(key !== 'page' ? { page: undefined } : {}) },
  })
}

function toggleSort(field: string) {
  const isSame = filters.value.sortBy === field
  router.push({
    query: {
      ...route.query,
      sortBy: field,
      sortOrder: isSame && filters.value.sortOrder === 'desc' ? 'asc' : 'desc',
      page: undefined,
    },
  })
}

function sortIcon(field: string) {
  if (filters.value.sortBy !== field) return ''
  return filters.value.sortOrder === 'desc' ? ' ↓' : ' ↑'
}

const { data, pending, refresh } = await useAsyncData<PaginatedResponse<IncidentRow>>(
  'incidents-list',
  () => fetchIncidents(filters.value),
  { watch: [filters] },
)

const incidents = computed(() => data.value?.data ?? [])
const pagination = computed(() => data.value?.pagination ?? null)

const statusOptions: { value: IncidentStatus; label: string }[] = [
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
]

const statusTextClass: Record<IncidentStatus, string> = {
  OPEN:        'text-blue-300',
  IN_PROGRESS: 'text-amber-300',
  RESOLVED:    'text-emerald-300',
  CLOSED:      'text-zinc-400',
}

async function handleStatusChange(incident: IncidentRow, status: IncidentStatus) {
  try {
    await updateIncident(incident.id, { status })
    await refresh()
  } catch {
    await refresh()
  }
}

const selectCls = 'px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-[13px] text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors'
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Page header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-base font-semibold text-white">Incidents</h1>
        <p v-if="pagination" class="text-xs text-zinc-500 mt-0.5">
          {{ pagination.total }} total
        </p>
      </div>
      <NuxtLink
        to="/incidents/new"
        class="h-8 px-3.5 bg-white text-zinc-900 text-[13px] font-semibold rounded-lg hover:bg-zinc-100 active:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
      >
        <span class="text-base leading-none">+</span> New incident
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <div class="relative flex-1 min-w-52">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search incidents…"
          class="w-full h-8 pl-3 pr-3 bg-zinc-900 border border-zinc-700 rounded-lg text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
        />
      </div>
      <select :value="filters.status ?? ''" :class="selectCls" @change="setFilter('status', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      <select :value="filters.category ?? ''" :class="selectCls" @change="setFilter('category', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All categories</option>
        <option value="HARDWARE">Hardware</option>
        <option value="SOFTWARE">Software</option>
        <option value="NETWORK">Network</option>
        <option value="ACCESS">Access</option>
        <option value="EMAIL">Email</option>
        <option value="PRINTER">Printer</option>
        <option value="PHONE">Phone</option>
        <option value="OTHER">Other</option>
      </select>
      <select :value="filters.priority ?? ''" :class="selectCls" @change="setFilter('priority', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-zinc-800">
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-zinc-200"
              :class="filters.sortBy === 'title' ? 'text-zinc-200' : 'text-zinc-500'"
              @click="toggleSort('title')"
            >Title{{ sortIcon('title') }}</th>
            <th class="px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Reporter</th>
            <th class="px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-zinc-200"
              :class="filters.sortBy === 'priority' ? 'text-zinc-200' : 'text-zinc-500'"
              @click="toggleSort('priority')"
            >Priority{{ sortIcon('priority') }}</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-zinc-200"
              :class="filters.sortBy === 'status' ? 'text-zinc-200' : 'text-zinc-500'"
              @click="toggleSort('status')"
            >Status{{ sortIcon('status') }}</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-zinc-200"
              :class="filters.sortBy === 'createdAt' ? 'text-zinc-200' : 'text-zinc-500'"
              @click="toggleSort('createdAt')"
            >Created{{ sortIcon('createdAt') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/70">
          <tr v-if="pending">
            <td colspan="6" class="px-4 py-12 text-center text-sm text-zinc-600">Loading…</td>
          </tr>
          <tr v-else-if="!incidents.length">
            <td colspan="6" class="px-4 py-12 text-center">
              <p class="text-sm text-zinc-500">No incidents found.</p>
              <NuxtLink to="/incidents/new" class="mt-2 inline-block text-xs text-zinc-400 hover:text-white underline transition-colors">
                Create one
              </NuxtLink>
            </td>
          </tr>
          <tr
            v-for="incident in incidents"
            v-else
            :key="incident.id"
            class="hover:bg-zinc-800/40 transition-colors group"
          >
            <td class="px-4 py-3 max-w-xs">
              <NuxtLink
                :to="`/incidents/${incident.id}`"
                class="text-[13px] font-medium text-zinc-100 hover:text-white line-clamp-1 transition-colors"
              >
                {{ incident.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 text-[13px] text-zinc-400 whitespace-nowrap">{{ incident.reporterName }}</td>
            <td class="px-4 py-3 text-[13px] text-zinc-400">{{ CATEGORY_LABELS[incident.category] }}</td>
            <td class="px-4 py-3">
              <PriorityBadge :priority="incident.priority" />
            </td>
            <td class="px-4 py-3">
              <select
                :value="incident.status"
                class="bg-transparent border-none text-xs font-medium cursor-pointer focus:outline-none py-0.5 -ml-0.5 rounded"
                :class="statusTextClass[incident.status]"
                @change="handleStatusChange(incident, ($event.target as HTMLSelectElement).value as IncidentStatus)"
              >
                <option
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  :value="opt.value"
                  class="bg-zinc-900 text-white"
                >
                  {{ opt.label }}
                </option>
              </select>
            </td>
            <td class="px-4 py-3 text-[13px] text-zinc-500 whitespace-nowrap tabular-nums">
              {{ formatDate(incident.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>

      <AppPagination
        v-if="pagination && pagination.totalPages > 1"
        :pagination="pagination"
        @change="setFilter('page', $event)"
      />
    </div>
  </div>
</template>
