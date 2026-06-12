<script setup lang="ts">
import type { DashboardStats } from '~/types'
import { CATEGORY_LABELS } from '~/types'

useHead({ title: 'Dashboard' })

const { data: stats, pending } = await useAsyncData<DashboardStats>(
  'dashboard-stats',
  () => $fetch('/api/dashboard/stats'),
)

const statusCount = (status: string) =>
  stats.value?.statusBreakdown.find((s) => s.status === status)?.count ?? 0

const total = computed(() =>
  (stats.value?.statusBreakdown ?? []).reduce((sum, s) => sum + s.count, 0),
)
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <div class="mb-6">
      <h1 class="text-base font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">Overview of all incidents.</p>
    </div>

    <div v-if="pending" class="text-sm text-gray-400 dark:text-zinc-600">Loading…</div>

    <template v-else-if="stats">

      <!-- Stat cards -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-xs text-gray-500 mb-1.5 dark:text-zinc-500">This week</p>
          <p class="text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{{ stats.totalThisWeek }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-xs text-gray-500 mb-1.5 dark:text-zinc-500">This month</p>
          <p class="text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{{ stats.totalThisMonth }}</p>
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <p class="text-xs text-amber-600 mb-1.5 dark:text-amber-400">In Progress</p>
          <p class="text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{{ statusCount('IN_PROGRESS') }}</p>
        </div>
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
          <p class="text-xs text-red-600 mb-1.5 dark:text-red-400">Irresolvable</p>
          <p class="text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{{ statusCount('IRRESOLVABLE') }}</p>
        </div>
      </div>

      <!-- Resolution time -->
      <div v-if="stats.avgResolutionHours != null" class="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 dark:text-zinc-500">Avg. Resolution Time</p>
        <p class="text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{{ stats.avgResolutionHours.toFixed(1) }}h</p>
      </div>

      <!-- Breakdowns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- By Status -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-4 dark:text-zinc-500">By Status</p>
          <div class="space-y-3">
            <div v-for="item in stats.statusBreakdown" :key="item.status" class="space-y-1.5">
              <div class="flex items-center justify-between">
                <StatusBadge :status="item.status as any" />
                <span class="text-xs font-medium text-gray-700 tabular-nums dark:text-zinc-300">{{ item.count }}</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-zinc-800">
                <div
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-amber-500':   item.status === 'IN_PROGRESS',
                    'bg-emerald-500': item.status === 'RESOLVED',
                    'bg-red-500':     item.status === 'IRRESOLVABLE',
                  }"
                  :style="{ width: total ? `${((item.count / total) * 100).toFixed(0)}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- By Category -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-4 dark:text-zinc-500">By Category</p>
          <div class="space-y-2.5">
            <div v-for="item in stats.categoryBreakdown" :key="item.category" class="flex items-center justify-between">
              <span class="text-[13px] text-gray-700 dark:text-zinc-300">
                {{ CATEGORY_LABELS[item.category] }}
              </span>
              <div class="flex items-center gap-2">
                <div class="h-1 w-16 rounded-full bg-gray-100 overflow-hidden dark:bg-zinc-800">
                  <div
                    class="h-full rounded-full bg-gray-400 transition-all dark:bg-zinc-500"
                    :style="{ width: total ? `${((item.count / total) * 100).toFixed(0)}%` : '0%' }"
                  />
                </div>
                <span class="text-xs font-medium text-gray-500 tabular-nums w-5 text-right dark:text-zinc-400">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>
