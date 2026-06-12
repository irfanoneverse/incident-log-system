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
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-zinc-950">
    <div class="w-full max-w-[360px]">

      <!-- Logo -->
      <div class="mb-8 flex items-center gap-3">
        <div class="h-7 w-7 rounded-md bg-orange-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
        <span class="text-sm font-semibold text-gray-900 tracking-tight dark:text-white">Incident Tracking System</span>
      </div>

      <!-- Card -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-2xl dark:shadow-black/40">
        <h1 class="text-[15px] font-semibold text-gray-900 dark:text-white">Welcome back</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">Sign in to continue to your workspace.</p>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-gray-700 dark:text-zinc-300">Username</label>
            <input
              v-model="form.username"
              type="text"
              autocomplete="username"
              required
              class="w-full h-9 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-gray-700 dark:text-zinc-300">Password</label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full h-9 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20"
            />
          </div>

          <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 dark:bg-red-950/50 dark:border-red-900/50">
            <span class="text-xs text-red-600 dark:text-red-400">{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-1 w-full h-9 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200"
          >
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</template>
