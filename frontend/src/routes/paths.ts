export const ROUTES = {
  dashboard: '/dashboard',
  jobs: '/jobs',
  documents: '/documents',
  system: '/system',
  proxies: '/proxies',
  settings: '/settings',
  help: '/help',
  login: '/login',
  testAuth: '/test-auth'
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];