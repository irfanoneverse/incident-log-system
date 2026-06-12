<script setup lang="ts">
import type { DashboardStats } from '~/types'

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
      <h1 class="text-base font-semibold text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-zinc-400">Overview of all incidents.</p>
    </div>

    <div v-if="pending" class="text-sm text-zinc-600">Loading…</div>

    <template v-else-if="stats">

      <!-- Stat cards -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs text-zinc-500 mb-1.5">This week</p>
          <p class="text-2xl font-semibold text-white tabular-nums">{{ stats.totalThisWeek }}</p>
        </div>
        <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs text-zinc-500 mb-1.5">This month</p>
          <p class="text-2xl font-semibold text-white tabular-nums">{{ stats.totalThisMonth }}</p>
        </div>
        <div class="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4">
          <p class="text-xs text-blue-400 mb-1.5">Open</p>
          <p class="text-2xl font-semibold text-white tabular-nums">{{ statusCount('OPEN') }}</p>
        </div>
        <div class="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <p class="text-xs text-amber-400 mb-1.5">In Progress</p>
          <p class="text-2xl font-semibold text-white tabular-nums">{{ statusCount('IN_PROGRESS') }}</p>
        </div>
      </div>

      <!-- Resolution time -->
      <div v-if="stats.avgResolutionHours != null" class="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Avg. Resolution Time</p>
        <p class="text-2xl font-semibold text-white tabular-nums">{{ stats.avgResolutionHours.toFixed(1) }}h</p>
      </div>

      <!-- Breakdowns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- By Status -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">By Status</p>
          <div class="space-y-3">
            <div v-for="item in stats.statusBreakdown" :key="item.status" class="space-y-1.5">
              <div class="flex items-center justify-between">
                <StatusBadge :status="item.status as any" />
                <span class="text-xs font-medium text-zinc-300 tabular-nums">{{ item.count }}</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-blue-500':    item.status === 'OPEN',
                    'bg-amber-500':   item.status === 'IN_PROGRESS',
                    'bg-emerald-500': item.status === 'RESOLVED',
                    'bg-zinc-500':    item.status === 'CLOSED',
                  }"
                  :style="{ width: total ? `${((item.count / total) * 100).toFixed(0)}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- By Category -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">By Category</p>
          <div class="space-y-2.5">
            <div v-for="item in stats.categoryBreakdown" :key="item.category" class="flex items-center justify-between">
              <span class="text-[13px] text-zinc-300">
                {{ item.category.charAt(0) + item.category.slice(1).toLowerCase() }}
              </span>
              <div class="flex items-center gap-2">
                <div class="h-1 w-16 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-zinc-500 transition-all"
                    :style="{ width: total ? `${((item.count / total) * 100).toFixed(0)}%` : '0%' }"
                  />
                </div>
                <span class="text-xs font-medium text-zinc-400 tabular-nums w-5 text-right">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>
