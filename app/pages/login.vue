<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Sign In' })

const { login } = useAuth()

const form = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(form.username, form.password)
    await navigateTo('/')
  } catch {
    error.value = 'Invalid username or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
    <div class="w-full max-w-[360px]">

      <!-- Logo -->
      <div class="mb-8 flex items-center gap-3">
        <div class="h-7 w-7 rounded-md bg-white flex items-center justify-center flex-shrink-0">
          <span class="text-[11px] font-bold text-zinc-900 tracking-tight">IL</span>
        </div>
        <span class="text-sm font-semibold text-white tracking-tight">IT Incident Log</span>
      </div>

      <!-- Card -->
      <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/40">
        <h1 class="text-[15px] font-semibold text-white">Welcome back</h1>
        <p class="mt-1 text-sm text-zinc-400">Sign in to continue to your workspace.</p>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-zinc-300">Username</label>
            <input
              v-model="form.username"
              type="text"
              autocomplete="username"
              required
              class="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-zinc-300">Password</label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
            />
          </div>

          <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-950/50 border border-red-900/50 px-3 py-2">
            <span class="text-xs text-red-400">{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-1 w-full h-9 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</template>
