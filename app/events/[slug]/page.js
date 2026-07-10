import BookEvent from "@/components/BookEvent";
import Image from "next/image";
import EventCard from "@/components/EventCard";
import { notFound } from "next/navigation";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)
const EventTags = ({ tags }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div className="pill" key={index}>{tag}</div>
      ))}
    </div>
  )
}
const EventDetailPage = async ({ params }) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${encodeURIComponent(slug)}`);
  if (!request.ok) {
    if (request.status === 404) notFound();
    throw new Error(`Failed to load event: ${request.status}`);
  }
  const { event } = await request.json();
  if (!event) notFound();
  const bookings = 10;
  const similarEvents = await getSimilarEventsBySlug(slug)
  // console.log('similar events',similarEvents);
  
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="">{event.description}</p>
      </div>
      <div className="details">
        {/* left side - event content */}
        <div className="content">
          <Image src={event.image} alt={event.name} width={800} height={800} className="banner" />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={new Date(event.date).toLocaleDateString()} />
            <EventDetailItem icon="/icons/pin.svg" alt="Location" label={event.location} />
            <EventDetailItem icon="/icons/clock.svg" alt="Time" label={event.time} />
            {Array.isArray(event.agenda) && event.agenda && (
              <EventAgenda agendaItems={event.agenda} />
            )}
            <EventDetailItem icon="/icons/audience.svg" alt="Audience" label={event.audience} />
          </section>
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          <EventTags tags={event.tags} />
        </div>
        {/* right side - booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} people who have already booked their spot</p>
            ) : (
                <p className="text-sm">Be the first to book your spot</p>
            )}
            <BookEvent/>
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2 className="text-2xl font-bold">Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent)=>(
          <EventCard key={similarEvent.title } title={similarEvent.title} image={similarEvent.image} slug={similarEvent.slug} location={similarEvent.location} date={similarEvent.date} time={similarEvent.time} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailPage