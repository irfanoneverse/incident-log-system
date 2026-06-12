<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()

const nav = [
  { label: 'Incidents', href: '/incidents', match: '/incidents' },
  { label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
]
</script>

<template>
  <div class="flex h-screen bg-zinc-950 overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-56 flex-shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800">

      <!-- App identity -->
      <div class="h-12 px-3 flex items-center gap-2.5 border-b border-zinc-800">
        <div class="h-6 w-6 rounded-md bg-white flex items-center justify-center flex-shrink-0">
          <span class="text-[10px] font-bold text-zinc-900 tracking-tight">IL</span>
        </div>
        <span class="text-sm font-semibold text-white tracking-tight truncate">IT Incident Log</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <NuxtLink
          v-for="item in nav"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors"
          :class="route.path.startsWith(item.match)
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Sign out -->
      <div class="p-2 border-t border-zinc-800">
        <button
          class="w-full flex items-center px-2.5 py-1.5 rounded-md text-[13px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          @click="logout"
        >
          Sign out
        </button>
      </div>

    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-zinc-950">
      <slot />
    </main>

  </div>
</template>
