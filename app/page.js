import {cacheLife} from "next/cache";

import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

// import events from "@/lib/constanst";
import { posthog } from "@/lib/posthog";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Home() {
  'use cache'
  cacheLife('hours')
  let events = [];
  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    if (response.ok) {
      ({ events } = await response.json());
    }
  } catch (err) {
    console.error("Failed to fetch events:", err);
  } const cookieStore = await cookies();
  const distinctId = cookieStore.get("ph_distinct_id")?.value ?? "anonymous";
  posthog.capture({
    distinctId,
    event: "home page viewed",
    properties: {
      $current_url: "/",
    },
  });

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev Event <br /> You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackatons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events" style={{ listStyleType: 'none' }}>
          {events && events.length > 0 && events.map((event) => (
            <li key={event.title} >
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
