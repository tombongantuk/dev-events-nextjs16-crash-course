<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16 (App Router) project. The integration includes both server-side tracking via `posthog-node` (already in place) and newly added client-side tracking via `posthog-js` initialized through `instrumentation-client.js`. A reverse proxy was configured in `next.config.mjs` to route PostHog requests through `/ingest`, improving reliability and ad-blocker resistance. Two additional server action event handlers (`trackHomeNavClicked`, `trackEventsNavClicked`) were added to `app/actions.js` and wired into `components/Navbar.jsx` to complete coverage of all navigation interactions. Environment variables for both server-side (`POSTHOG_API_KEY`, `POSTHOG_HOST`) and client-side (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`) have been set in `.env.local`.

| Event Name | Description | File |
|---|---|---|
| `home page viewed` | User lands on the home page and sees the featured events listing. | `app/page.js` |
| `explore button clicked` | User clicks the 'Explore Event' CTA button to scroll to the events section. | `components/ExploreBtn.jsx` |
| `event card clicked` | User clicks on an event card to navigate to the event detail page. | `components/EventCard.jsx` |
| `create event nav clicked` | User clicks the 'Create Event' link in the navigation, signaling conversion intent. | `components/Navbar.jsx` |
| `home nav clicked` | User clicks the 'Home' link in the navigation bar. | `components/Navbar.jsx` |
| `events nav clicked` | User clicks the 'Events' link in the navigation bar. | `components/Navbar.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/211650/dashboard/779405)
- [Event Card Clicks Over Time](https://eu.posthog.com/project/211650/insights/pMvbsXaj)
- [Home Page Views Over Time](https://eu.posthog.com/project/211650/insights/bWuyIpbe)
- [Event Discovery Funnel](https://eu.posthog.com/project/211650/insights/8E9NYYwf)
- [Navigation Clicks by Type](https://eu.posthog.com/project/211650/insights/sOGsPZZL)
- [Daily Active Users](https://eu.posthog.com/project/211650/insights/bMruHW4d)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY`, `POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_KEY`, and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
