import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addDays, eachDayOfInterval, format } from "date-fns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type BlockedDateRow = {
  date: string | null;
};

type InquiryRow = {
  check_in: string | null;
  check_out: string | null;
  // status?: string | null; // add & filter if you only want confirmed bookings
};

export async function GET() {
  try {
    // 1) Admin-blocked single dates
    const { data: blockedRows, error: blockedError } = await supabase
      .from<BlockedDateRow>("blocked_dates")
      .select("date");

    if (blockedError) {
      console.error("blocked_dates error", blockedError);
      throw blockedError;
    }

    // 2) Booked ranges (inquiries / bookings)
    const { data: inquiries, error: inquiriesError } = await supabase
      .from<InquiryRow>("inquiries")
      .select("check_in, check_out");

    if (inquiriesError) {
      console.error("inquiries error", inquiriesError);
      throw inquiriesError;
    }

    const blockedSet = new Set<string>();

    // A) Single blocked days
    (blockedRows || []).forEach((row) => {
      if (!row.date) return;
      // assume row.date is already yyyy-MM-dd or ISO
      const d = new Date(row.date);
      blockedSet.add(format(d, "yyyy-MM-dd"));
    });

    // B) Blocked ranges from inquiries
    (inquiries || []).forEach((inq) => {
      if (!inq.check_in || !inq.check_out) return;

      const start = new Date(inq.check_in);
      const end = new Date(inq.check_out);

      // block every night from check_in to (check_out - 1)
      const days = eachDayOfInterval({
        start,
        end: addDays(end, -1),
      });

      days.forEach((d) => {
        blockedSet.add(format(d, "yyyy-MM-dd"));
      });
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
