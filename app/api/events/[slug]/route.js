import { NextResponse } from 'next/server';
import { Event } from '@/database';
import connectToDatabase from '@/lib/mongodb';

/**
 * GET /api/events/[slug]
 * Fetch a single event by its slug.
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { slug } = await params

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return NextResponse.json(
        { error: 'Missing or invalid slug parameter' },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ slug: slug.trim() }).lean().exec();
    if (!event) {
      return NextResponse.json(
        { error: `Event not found for slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Event lookup failed", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
