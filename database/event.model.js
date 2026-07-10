import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

/**
 * Convert a title string into a URL-friendly slug.
 */
const createSlug = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Normalize a date string to ISO format and reject invalid dates.
 */
const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString();
};

/**
 * Normalize time to a consistent HH:mm format.
 */
const normalizeTime = (value) => {
  const raw = value.toString().trim();
  const ampm = /^([0-9]{1,2})(?::([0-9]{2}))?\s*(am|pm)$/i;
  const twentyFour = /^([01]?\d|2[0-3]):([0-5]\d)$/;

  let hours;
  let minutes;

  const ampmMatch = raw.match(ampm);
  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const period = ampmMatch[3].toLowerCase();
    if (hours === 12) hours = period === 'am' ? 0 : 12;
    else if (period === 'pm') hours += 12;
  } else {
    const twentyFourMatch = raw.match(twentyFour);
    if (!twentyFourMatch) {
      throw new Error('Invalid time format');
    }
    hours = parseInt(twentyFourMatch[1], 10);
    minutes = parseInt(twentyFourMatch[2], 10);
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const nonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true, strict: true }
);

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.pre('save', async function () {
  if (!nonEmptyString(this.title)) {
    return new Error('title is required');
  }

  if (!nonEmptyString(this.description)) {
    return new Error('description is required');
  }

  if (!nonEmptyString(this.overview)) {
    return new Error('overview is required');
  }

  if (!nonEmptyString(this.image)) {
    return new Error('image is required');
  }

  if (!nonEmptyString(this.venue)) {
    return new Error('venue is required');
  }

  if (!nonEmptyString(this.location)) {
    return new Error('location is required');
  }

  if (!nonEmptyString(this.date)) {
    return new Error('date is required');
  }

  if (!nonEmptyString(this.time)) {
    return new Error('time is required');
  }

  if (!nonEmptyString(this.mode)) {
    return new Error('mode is required');
  }

  if (!nonEmptyString(this.audience)) {
    return new Error('audience is required');
  }

  if (!nonEmptyArray(this.agenda)) {
    return new Error('agenda is required');
  }

  if (!nonEmptyString(this.organizer)) {
    return new Error('organizer is required');
  }

  if (!nonEmptyArray(this.tags)) {
    return new Error('tags are required');
  }

  try {
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);
  } catch (err) {
    return err;
  }

  if (this.isModified('title') || this.isNew) {
    this.slug = createSlug(this.title);
  }
});

const Event = models.Event || model('Event', EventSchema);
export default Event;
