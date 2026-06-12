/**
 * Reactive authentication state and actions.
 * Shares a single `useState` across the app so any component can read auth status.
 */
export function useAuth() {
  // null = unknown (not yet checked), true = authenticated, false = not authenticated
  const authenticated = useState<boolean | null>('auth.state', () => null)

  /** Fetches auth status from the server and updates shared state. */
  async function fetchAuthState() {
    try {
      const data = await $fetch<{ authenticated: boolean }>('/api/auth/me')
      authenticated.value = data.authenticated
    } catch {
      authenticated.value = false
    }
  }

  /** Submits credentials and marks state as authenticated on success. */
  async function login(username: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    authenticated.value = true
  }

  /** Clears the session cookie and redirects to login. */
  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authenticated.value = false
    await navigateTo('/login')
  }

  return { authenticated, fetchAuthState, login, logout }
}
