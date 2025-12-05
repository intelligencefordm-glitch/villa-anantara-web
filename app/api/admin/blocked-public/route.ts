import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addDays, eachDayOfInterval, format } from "date-fns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    // Admin-blocked dates
    const { data: blockedRows, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date");

    if (blockedError) throw blockedError;

    // Inquiries / bookings
    const { data: inquiries, error: inquiriesError } = await supabase
      .from("inquiries")
      .select("check_in, check_out");

    if (inquiriesError) throw inquiriesError;

    const blockedSet = new Set<string>();

    // A) Single-day admin blocks
    (blockedRows || []).forEach((row: any) => {
      if (!row.date) return;
      const d = new Date(row.date);
      blockedSet.add(format(d, "yyyy-MM-dd"));
    });

    // B) Blocked ranges from inquiries
    (inquiries || []).forEach((inq: any) => {
      if (!inq.check_in || !inq.check_out) return;

      const start = new Date(inq.check_in);
      const end = new Date(inq.check_out);

      const days = eachDayOfInterval({
        start,
        end: addDays(end, -1),
      });

      days.forEach((d) => blockedSet.add(format(d, "yyyy-MM-dd")));
    });

    return NextResponse.json(
      { blocked: Array.from(blockedSet) },
      { status: 200 }
    );
  } catch (error) {
    console.error("blocked-public GET error", error);
    return NextResponse.json(
      { error: "Failed to load blocked dates" },
      { status: 500 }
    );
  }
}
