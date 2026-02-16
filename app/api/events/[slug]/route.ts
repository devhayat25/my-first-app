import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/**
 * GET handler for fetching a single event by slug.
 * @param request - The incoming request object.
 * @param context - Contains route parameters, including slug.
 * @returns JSON response with event data or error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Await params as per Next.js app router
    const { slug } = await params;
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    // Connect to the database
    await connectDB();

    // Query the Event model for the matching slug
    const event: IEvent | null = await Event.findOne({ slug: slug.trim() });

    // If event not found, return 404
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Return the event data
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching event by slug:", error);

    // Return a generic error response
    return NextResponse.json(
      {
        message: "An unexpected error occurred while fetching the event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
