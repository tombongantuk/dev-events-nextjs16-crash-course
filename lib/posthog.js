import { PostHog } from 'posthog-node'

const globalForPosthog = globalThis

export const posthog =
  globalForPosthog.posthog ??
  new PostHog(process.env.POSTHOG_API_KEY, {
    host: process.env.POSTHOG_HOST,
    enableExceptionAutocapture: true,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPosthog.posthog = posthog
}
