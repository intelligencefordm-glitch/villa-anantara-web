import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const occasion =
      typeof body.occasion === "string" ? body.occasion.trim() : "";
    const checkIn = body.check_in;
    const checkOut = body.check_out;
    const guests = Number(body.guests);

    if (!name || !phone || !isValidDate(checkIn) || !isValidDate(checkOut)) {
      return NextResponse.json(
        { error: "Please provide your name, phone number, and valid stay dates." },
        { status: 400 }
      );
    }

    if (name.length > 100 || phone.length > 20 || occasion.length > 200) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 100) {
      return NextResponse.json(
        { error: "Please enter a valid number of guests." },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (checkIn < todayString) {
      return NextResponse.json(
        { error: "Check-in must be today or a future date." },
        { status: 400 }
      );
    }

    const nights = Math.round(
      (Date.parse(`${checkOut}T00:00:00Z`) -
        Date.parse(`${checkIn}T00:00:00Z`)) /
        (24 * 60 * 60 * 1000)
    );

    const supabase = getSupabase();

    // Check manually blocked dates. Checkout day is excluded.
    const { data: blockedDates, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date")
      .gte("date", checkIn)
      .lt("date", checkOut);

    if (blockedError) {
      console.error("Blocked-date check failed:", blockedError);

      return NextResponse.json(
        { error: "We couldn't verify those dates. Please try again later." },
        { status: 500 }
      );
    }

    if (blockedDates && blockedDates.length > 0) {
      return NextResponse.json(
        {
          error:
            "Those dates cannot be requested. Please contact us for assistance.",
        },
        { status: 409 }
      );
    }

    // Check whether the requested stay overlaps an existing confirmed booking.
    // Two stays overlap when existing check-in < requested check-out
    // and existing check-out > requested check-in.
    const { data: bookings, error: bookingsError } = await supabase
      .from("confirmed_bookings")
      .select("check_in, check_out")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (bookingsError) {
      console.error("Confirmed-booking check failed:", bookingsError);

      return NextResponse.json(
        { error: "We couldn't verify those dates. Please try again later." },
        { status: 500 }
      );
    }

    if (bookings && bookings.length > 0) {
      return NextResponse.json(
        {
          error:
            "Those dates cannot be requested. Please contact us for assistance.",
        },
        { status: 409 }
      );
    }

    // Only valid, non-conflicting requests are saved as inquiries.
    // Inquiries themselves do not block dates.
    const { error: insertError } = await supabase.from("inquiries").insert({
      name,
      phone,
      guests,
      occasion: occasion || null,
      check_in: checkIn,
      check_out: checkOut,
      nights,
    });

    if (insertError) {
      console.error("Inquiry insert failed:", insertError);

      return NextResponse.json(
        { error: "We couldn't submit your inquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your booking inquiry has been submitted. We will contact you to confirm availability.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
