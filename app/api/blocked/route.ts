import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRole) {
      console.error("Missing Supabase server configuration");
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceRole);

    // Fetch manually blocked dates.
    const { data: blockedRows, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date");

    if (blockedError) {
      console.error("Failed to fetch blocked dates:", blockedError);
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 }
      );
    }

    // Fetch booking date ranges only. No guest or payment details are returned.
    const { data: bookingRows, error: bookingError } = await supabase
      .from("confirmed_bookings")
      .select("check_in, check_out");

    if (bookingError) {
      console.error("Failed to fetch booking dates:", bookingError);
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 }
      );
    }

    const blockedDates = new Set<string>();

    // Add dates blocked manually in the admin calendar.
    for (const row of blockedRows ?? []) {
      if (row.date) {
        blockedDates.add(String(row.date).slice(0, 10));
      }
    }

    // Expand every booking into occupied nights.
    // The check-out date is deliberately excluded.
    for (const booking of bookingRows ?? []) {
      if (!booking.check_in || !booking.check_out) continue;

      const start = String(booking.check_in).slice(0, 10);
      const end = String(booking.check_out).slice(0, 10);

      const startDate = new Date(`${start}T00:00:00.000Z`);
      const endDate = new Date(`${end}T00:00:00.000Z`);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime()) ||
        endDate <= startDate
      ) {
        continue;
      }

      const cursor = new Date(startDate);

      while (cursor < endDate) {
        blockedDates.add(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }

    return NextResponse.json(
      { blocked: Array.from(blockedDates).sort() },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Blocked dates route crashed:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
