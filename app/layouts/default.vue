<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()
const colorMode = useColorMode()

const nav = [
  { label: 'Incidents', href: '/incidents', match: '/incidents' },
  { label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
]

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden dark:bg-zinc-950">

    <!-- Sidebar -->
    <aside class="w-56 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">

      <!-- App identity -->
      <div class="h-12 px-3 flex items-center gap-2.5 border-b border-gray-200 dark:border-zinc-800">
        <div class="h-6 w-6 rounded-md bg-orange-500 flex items-center justify-center flex-shrink-0">
          <!-- Alert triangle icon -->
          <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
        <span class="text-sm font-semibold text-gray-900 tracking-tight truncate dark:text-white">Incident Tracking</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <NuxtLink
          v-for="item in nav"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors"
          :class="route.path.startsWith(item.match)
            ? 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Bottom actions -->
      <div class="p-2 border-t border-gray-200 space-y-0.5 dark:border-zinc-800">
        <!-- Theme toggle -->
        <button
          class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60"
          @click="toggleTheme"
        >
          <!-- Sun icon (shown in dark mode to switch to light) -->
          <svg v-if="isDark" class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
          </svg>
          <!-- Moon icon (shown in light mode to switch to dark) -->
          <svg v-else class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
          </svg>
          {{ isDark ? 'Light mode' : 'Dark mode' }}
        </button>
        <!-- Sign out -->
        <button
          class="w-full flex items-center px-2.5 py-1.5 rounded-md text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60"
          @click="logout"
        >
          Sign out
        </button>
      </div>

    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
      <slot />
    </main>

  </div>
</template>
