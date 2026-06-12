<script setup lang="ts">
import type { IncidentRow, IncidentStatus, PaginatedResponse } from '~/types'
import { CATEGORY_LABELS } from '~/types'

useHead({ title: 'Incidents' })

const { fetchIncidents, updateIncident, deleteIncident } = useIncidents()
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

// Reactive map of in-flight status overrides (useAsyncData uses shallowRef — direct mutation is not reactive)
const statusOverrides = reactive(new Map<string, IncidentStatus>())

function effectiveStatus(incident: IncidentRow): IncidentStatus {
  return statusOverrides.get(incident.id) ?? incident.status
}

async function handleStatusChange(incident: IncidentRow, status: IncidentStatus) {
  statusOverrides.set(incident.id, status)
  try {
    await updateIncident(incident.id, { status })
  } catch {
    statusOverrides.delete(incident.id) // revert to server value on failure
  }
}

const pendingDeleteId = ref<string | null>(null)
const pendingDeleteTitle = ref('')
const deleting = ref(false)

function requestDelete(incident: IncidentRow) {
  pendingDeleteId.value = incident.id
  pendingDeleteTitle.value = incident.title
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return
  const id = pendingDeleteId.value
  deleting.value = true
  try {
    await deleteIncident(id)
    pendingDeleteId.value = null
    await refresh()
  } catch {
    // keep dialog open so user sees it failed
  } finally {
    deleting.value = false
  }
}

const selectCls = 'px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-gray-500 transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:focus:border-zinc-500'
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Page header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-base font-semibold text-gray-900 dark:text-white">Incidents</h1>
        <p v-if="pagination" class="text-xs text-gray-400 mt-0.5 dark:text-zinc-500">
          {{ pagination.total }} total
        </p>
      </div>
      <NuxtLink
        to="/incidents/new"
        class="h-8 px-3.5 bg-gray-900 text-white text-[13px] font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors inline-flex items-center gap-1.5 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200"
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
          class="w-full h-8 pl-3 pr-3 bg-white border border-gray-300 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
        />
      </div>
      <select :value="filters.status ?? ''" :class="selectCls" @change="setFilter('status', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All statuses</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="IRRESOLVABLE">Irresolvable</option>
      </select>
      <select :value="filters.category ?? ''" :class="selectCls" @change="setFilter('category', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All categories</option>
        <option value="HARDWARE">Hardware</option>
        <option value="SOFTWARE">Software</option>
        <option value="NETWORK">Network</option>
        <option value="OTHERS">Others</option>
      </select>
      <select :value="filters.priority ?? ''" :class="selectCls" @change="setFilter('priority', ($event.target as HTMLSelectElement).value || undefined)">
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="CRITICAL">Critical</option>
      </select>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-gray-200 dark:border-zinc-800">
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-gray-900 dark:hover:text-zinc-200"
              :class="filters.sortBy === 'title' ? 'text-gray-900 dark:text-zinc-200' : 'text-gray-500 dark:text-zinc-500'"
              @click="toggleSort('title')"
            >Title{{ sortIcon('title') }}</th>
            <th class="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider dark:text-zinc-500">Reporter</th>
            <th class="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider dark:text-zinc-500">Category</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-gray-900 dark:hover:text-zinc-200"
              :class="filters.sortBy === 'priority' ? 'text-gray-900 dark:text-zinc-200' : 'text-gray-500 dark:text-zinc-500'"
              @click="toggleSort('priority')"
            >Priority{{ sortIcon('priority') }}</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-gray-900 dark:hover:text-zinc-200"
              :class="filters.sortBy === 'status' ? 'text-gray-900 dark:text-zinc-200' : 'text-gray-500 dark:text-zinc-500'"
              @click="toggleSort('status')"
            >Status{{ sortIcon('status') }}</th>
            <th
              class="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-gray-900 dark:hover:text-zinc-200"
              :class="filters.sortBy === 'createdAt' ? 'text-gray-900 dark:text-zinc-200' : 'text-gray-500 dark:text-zinc-500'"
              @click="toggleSort('createdAt')"
            >Created{{ sortIcon('createdAt') }}</th>
            <th class="w-10" /></tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-zinc-800/70">
          <tr v-if="pending">
            <td colspan="6" class="px-4 py-12 text-center text-sm text-gray-400 dark:text-zinc-600">Loading…</td>
          </tr>
          <tr v-else-if="!incidents.length">
            <td colspan="6" class="px-4 py-12 text-center">
              <p class="text-sm text-gray-500 dark:text-zinc-500">No incidents found.</p>
              <NuxtLink to="/incidents/new" class="mt-2 inline-block text-xs text-gray-400 hover:text-gray-900 underline transition-colors dark:text-zinc-400 dark:hover:text-white">
                Create one
              </NuxtLink>
            </td>
          </tr>
          <tr
            v-for="incident in incidents"
            v-else
            :key="incident.id"
            class="hover:bg-gray-50 transition-colors group dark:hover:bg-zinc-800/40"
          >
            <td class="px-4 py-3 max-w-xs">
              <NuxtLink
                :to="`/incidents/${incident.id}`"
                class="text-[13px] font-medium text-gray-800 hover:text-gray-900 line-clamp-1 transition-colors dark:text-zinc-100 dark:hover:text-white"
              >
                {{ incident.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 text-[13px] text-gray-500 whitespace-nowrap dark:text-zinc-400">{{ incident.reporterName }}</td>
            <td class="px-4 py-3 text-[13px] text-gray-500 dark:text-zinc-400">{{ CATEGORY_LABELS[incident.category] }}</td>
            <td class="px-4 py-3">
              <PriorityBadge :priority="incident.priority" />
            </td>
            <td class="px-4 py-3">
              <StatusSelect
                :value="effectiveStatus(incident)"
                @change="handleStatusChange(incident, $event)"
              />
            </td>
            <td class="px-4 py-3 text-[13px] text-gray-400 whitespace-nowrap tabular-nums dark:text-zinc-500">
              {{ formatDate(incident.createdAt) }}
            </td>
            <td class="pr-3 py-3 text-right">
              <button
                class="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
                title="Delete incident"
                @click.stop="requestDelete(incident)"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
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

  <ConfirmDialog
    :open="!!pendingDeleteId"
    title="Delete incident?"
    :message="`'${pendingDeleteTitle}' will be permanently deleted and cannot be recovered.`"
    confirm-label="Delete"
    :loading="deleting"
    @confirm="confirmDelete"
    @cancel="pendingDeleteId = null"
  />
</template>
