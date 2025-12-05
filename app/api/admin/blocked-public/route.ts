export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    // Only admin-blocked dates
    const { data: blockedRows, error } = await supabase
      .from("blocked_dates")
      .select("date");

    if (error) {
      console.error("blocked-public error:", error);
      return NextResponse.json({ blocked: [] }, { status: 500 });
    }

    const blocked = (blockedRows || [])
      .map((row: any) => {
        const d = new Date(row.date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().slice(0, 10);
      })
      .filter(Boolean);

    return NextResponse.json(
      { blocked },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ blocked: [] }, { status: 500 });
  }
}
