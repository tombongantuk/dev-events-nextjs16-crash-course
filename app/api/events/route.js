import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    let event
    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON data format" }, { status: 400 })
    }
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
    const file = formData.get('image');
    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 })
    }
    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ message: "Image must be an image file" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ message: "Image is too large" }, { status: 413 });
    }

    let tags=JSON.parse(formData.get('tags'))
    let agenda=JSON.parse(formData.get('agenda'))
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer); const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvent" }, (error, results) => {
        if (error) {
          return reject(error)
        }
        resolve(results)
      }).end(buffer)
    })
    event.image = uploadResult.secure_url;
    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda:agenda
    });
    return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Event Creation Failed" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectToDatabase()
    const events = await Event.find().sort({ createdAt: -1 })
    return NextResponse.json({ message: "Event fetched successfully", events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Event fetching failed", error }, { status: 500 })
  }
}