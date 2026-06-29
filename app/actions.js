'use server'

import { posthog } from '@/lib/posthog'
import { cookies } from 'next/headers'

async function getOrCreateDistinctId() {
  const cookieStore = await cookies()
  let distinctId = cookieStore.get('ph_distinct_id')?.value
  if (!distinctId) {
    distinctId = crypto.randomUUID()
    cookieStore.set('ph_distinct_id', distinctId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    })
  }
  return distinctId
}

export async function trackExploreButtonClicked() {
  const distinctId = await getOrCreateDistinctId()
  posthog.capture({
    distinctId,
    event: 'explore button clicked',
  })
}

export async function trackEventCardClicked(title, slug, location) {
  const distinctId = await getOrCreateDistinctId()
  posthog.capture({
    distinctId,
    event: 'event card clicked',
    properties: {
      event_title: title,
      event_slug: slug,
      event_location: location,
    },
  })
}

export async function trackCreateEventNavClicked() {
  const distinctId = await getOrCreateDistinctId()
  posthog.capture({
    distinctId,
    event: 'create event nav clicked',
  })
}

export async function trackHomeNavClicked() {
  const distinctId = await getOrCreateDistinctId()
  posthog.capture({
    distinctId,
    event: 'home nav clicked',
  })
}

export async function trackEventsNavClicked() {
  const distinctId = await getOrCreateDistinctId()
  posthog.capture({
    distinctId,
    event: 'events nav clicked',
  })
}
