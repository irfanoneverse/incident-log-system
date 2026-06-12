/**
 * Global route guard.
 * Redirects unauthenticated users to /login and authenticated users away from /login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated, fetchAuthState } = useAuth()

  // Fetch once per session (null = not yet checked)
  if (authenticated.value === null) {
    await fetchAuthState()
  }

  if (to.path === '/login') {
    if (authenticated.value) return navigateTo('/')
    return
  }

  if (!authenticated.value) {
    return navigateTo('/login')
  }
})
